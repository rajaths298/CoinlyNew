import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  findNodeHandle,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { appColors as colors } from '../../theme';
import type { TutorialStep } from './types';

type Props = {
  step: TutorialStep | null;
  stepIndex: number;
  totalSteps: number;
  onAdvance: () => void;
  onSkip: () => void;
  /** The game's main ScrollView, so off-screen targets can be scrolled into view. */
  scrollRef?: React.RefObject<ScrollView | null>;
};

type Rect = { x: number; y: number; width: number; height: number };

// A measured node may be a RN host view (measureInWindow) or, on web, a DOM
// element (getBoundingClientRect). We probe whichever is available.
type MeasurableNode = {
  measureInWindow?: (cb: (x: number, y: number, width: number, height: number) => void) => void;
  getBoundingClientRect?: () => { left: number; top: number; width: number; height: number };
};

const PAD = 6;
const REMEASURE_MS = 250;
const SCROLL_BUFFER = 80; // px of breathing room above a scrolled-to target
const SCROLL_SETTLE_MS = 350; // covers a typical animated scroll

export default function TutorialOverlay({ step, stepIndex, totalSteps, onAdvance, onSkip, scrollRef }: Props) {
  const { width, height } = useWindowDimensions();
  const [rect, setRect] = useState<Rect | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [settling, setSettling] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  // A new step shouldn't inherit a leftover "skip?" prompt.
  useEffect(() => {
    setConfirming(false);
  }, [step]);

  // Measure the spotlight target — first scrolling it into view if it is
  // off-screen, so the spotlight never lands on an unseen element. The overlay
  // shows only a dim backdrop while scrolling, then reveals the spotlight once
  // the final position is measured. After that it polls lightly to stay locked
  // through further scrolling / late layout.
  // Web prefers getBoundingClientRect / scrollIntoView; native uses
  // measureInWindow + measureLayout + scrollTo.
  useEffect(() => {
    const targetRef = step?.targetRef;
    if (!targetRef) {
      setRect(null);
      setSettling(false);
      return undefined;
    }

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const fromDom = (node: MeasurableNode): Rect | null => {
      const r = node.getBoundingClientRect?.();
      if (!r) return null;
      return r.width || r.height ? { x: r.left, y: r.top, width: r.width, height: r.height } : null;
    };

    const measureNow = (cb: (r: Rect | null) => void) => {
      const node = targetRef.current as unknown as MeasurableNode | null;
      if (!node) {
        cb(null);
        return;
      }
      if (Platform.OS === 'web') {
        cb(fromDom(node));
        return;
      }
      if (node.measureInWindow) {
        node.measureInWindow((x, y, w, h) => cb(w > 0 || h > 0 ? { x, y, width: w, height: h } : fromDom(node)));
      } else {
        cb(fromDom(node));
      }
    };

    const apply = (next: Rect | null) => {
      if (cancelled) return;
      setRect((prev) => {
        if (!next) return prev === null ? prev : null;
        if (
          prev &&
          Math.abs(prev.x - next.x) < 0.5 &&
          Math.abs(prev.y - next.y) < 0.5 &&
          Math.abs(prev.width - next.width) < 0.5 &&
          Math.abs(prev.height - next.height) < 0.5
        ) {
          return prev;
        }
        return next;
      });
    };

    const beginPolling = () => {
      if (cancelled) return;
      setSettling(false);
      measureNow(apply);
      interval = setInterval(() => measureNow(apply), REMEASURE_MS);
    };

    const scrollIntoViewThen = (done: () => void) => {
      // Web: use the DOM node's smooth scrollIntoView.
      if (Platform.OS === 'web') {
        const dom = targetRef.current as unknown as { scrollIntoView?: (opts?: unknown) => void } | null;
        dom?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        setTimeout(done, SCROLL_SETTLE_MS);
        return;
      }
      // Native: find the target's offset within the ScrollView, then scrollTo.
      const scroller = scrollRef?.current ?? null;
      const scrollNode = scroller ? findNodeHandle(scroller) : null;
      const viewNode = targetRef.current;
      if (scroller && scrollNode != null && viewNode?.measureLayout) {
        viewNode.measureLayout(
          scrollNode,
          (_x: number, y: number) => {
            scroller.scrollTo({ y: Math.max(0, y - SCROLL_BUFFER), animated: true });
            setTimeout(done, SCROLL_SETTLE_MS);
          },
          () => done(),
        );
      } else {
        done();
      }
    };

    // Hide any prior spotlight, assume we may scroll (dim-only) until decided.
    setRect(null);
    setSettling(true);
    const raf = requestAnimationFrame(() => {
      measureNow((r) => {
        if (cancelled) return;
        const inView = !!r && r.height > 0 && r.y >= 8 && r.y + r.height <= height - 8;
        if (inView) {
          beginPolling();
        } else {
          scrollIntoViewThen(beginPolling);
        }
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (interval) clearInterval(interval);
    };
  }, [step, width, height, scrollRef]);

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [stepIndex, fade]);

  if (!step) return null;

  const dimEnabled = step.dim !== false;
  const onScreen = !!rect && rect.width > 0 && rect.y + rect.height > 8 && rect.y < height - 8;
  const isLast = stepIndex >= totalSteps - 1;

  const bubble = (placement: { centered?: boolean; forceNext?: boolean }) => (
    <Animated.View
      pointerEvents="auto"
      style={[
        styles.bubble,
        placement.centered ? styles.bubbleCentered : null,
        { opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] },
      ]}
    >
      <Text style={styles.counter}>STEP {stepIndex + 1} OF {totalSteps}</Text>
      <Text style={styles.heading}>{step.heading}</Text>
      <Text style={styles.body}>{step.body}</Text>
      {step.actionGated && !placement.forceNext ? (
        <View style={styles.gatedRow}>
          <View style={styles.hintChip}>
            <Text style={styles.hintChipText}>
              {step.dim === false ? 'Keep playing — this updates as you go' : 'Tap the highlighted area to continue'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setConfirming(true)} activeOpacity={0.7}>
            <Text style={styles.skipLink}>SKIP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.controlRow}>
          <TouchableOpacity onPress={() => setConfirming(true)} activeOpacity={0.7}>
            <Text style={styles.skipLink}>SKIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} activeOpacity={0.86} onPress={onAdvance}>
            <Text style={styles.nextButtonText}>{isLast ? 'GOT IT' : 'NEXT'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  if (confirming) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.overlayRoot, styles.confirmWrap]} pointerEvents="auto">
        <View style={styles.confirmCard}>
          <Text style={styles.heading}>Skip the rest of the tutorial?</Text>
          <Text style={styles.body}>You can replay it anytime with the ? button.</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={() => setConfirming(false)} activeOpacity={0.7}>
              <Text style={styles.skipLink}>KEEP GOING</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} activeOpacity={0.86} onPress={onSkip}>
              <Text style={styles.nextButtonText}>SKIP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // While scrolling the target into view, show only a dim backdrop (no
  // spotlight/bubble) so nothing flashes at the wrong position mid-scroll.
  if (settling) {
    return dimEnabled ? (
      <View style={[StyleSheet.absoluteFill, styles.overlayRoot, styles.fullDim]} pointerEvents="auto" />
    ) : null;
  }

  // No usable target. Non-blocking steps narrate from the bottom; blocking
  // steps fall back to a centered bubble over a full scrim.
  if (!onScreen) {
    if (!dimEnabled) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.overlayRoot, styles.bottomWrap]} pointerEvents="box-none">
          {bubble({ centered: true })}
        </View>
      );
    }
    return (
      <View style={[StyleSheet.absoluteFill, styles.overlayRoot, styles.centerWrap]} pointerEvents="box-none">
        <View style={[StyleSheet.absoluteFill, styles.fullDim]} pointerEvents="auto" />
        {bubble({ centered: true, forceNext: true })}
      </View>
    );
  }

  const safeRect = rect as Rect;
  const gap = PAD + 10;
  const placeBelow = height - (safeRect.y + safeRect.height) >= 210 || safeRect.y < 160;
  // Clamp the anchor so the bubble always keeps a minimum margin on screen.
  const bubblePos = placeBelow
    ? { left: 16, right: 16, top: Math.min(safeRect.y + safeRect.height + gap, height - 160) }
    : { left: 16, right: 16, bottom: Math.min(height - safeRect.y + gap, height - 160) };

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlayRoot]} pointerEvents="box-none">
      {dimEnabled ? (
        <>
          <View style={[styles.dim, { left: 0, top: 0, right: 0, height: Math.max(0, safeRect.y - PAD) }]} />
          <View style={[styles.dim, { left: 0, top: safeRect.y + safeRect.height + PAD, right: 0, bottom: 0 }]} />
          <View
            style={[styles.dim, { left: 0, top: Math.max(0, safeRect.y - PAD), width: Math.max(0, safeRect.x - PAD), height: safeRect.height + PAD * 2 }]}
          />
          <View
            style={[styles.dim, { left: safeRect.x + safeRect.width + PAD, top: Math.max(0, safeRect.y - PAD), right: 0, height: safeRect.height + PAD * 2 }]}
          />
        </>
      ) : null}

      <View
        pointerEvents="none"
        style={[styles.ring, { left: safeRect.x - PAD, top: safeRect.y - PAD, width: safeRect.width + PAD * 2, height: safeRect.height + PAD * 2 }]}
      />

      {/* Non-gated steps: block taps on the highlighted element so only Next advances. */}
      {dimEnabled && !step.actionGated ? (
        <View
          pointerEvents="auto"
          style={{ position: 'absolute', left: safeRect.x - PAD, top: safeRect.y - PAD, width: safeRect.width + PAD * 2, height: safeRect.height + PAD * 2 }}
        />
      ) : null}

      <View pointerEvents="box-none" style={[styles.bubbleAnchor, bubblePos]}>
        {bubble({})}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: { zIndex: 9999, elevation: 9999 },
  dim: { position: 'absolute', backgroundColor: 'rgba(16,36,29,0.62)' },
  ring: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: colors.yellow,
    borderRadius: 12,
  },
  bubbleAnchor: { position: 'absolute' },
  centerWrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  bottomWrap: { justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 28 },
  fullDim: { backgroundColor: 'rgba(16,36,29,0.62)' },
  confirmWrap: {
    backgroundColor: 'rgba(16,36,29,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 12,
    padding: 20,
  },
  bubble: {
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 12,
    padding: 16,
    maxWidth: 460,
    alignSelf: 'center',
    width: '100%',
  },
  bubbleCentered: { maxWidth: 420 },
  counter: { color: colors.muted, fontFamily: 'BebasNeue_400Regular', fontSize: 15 },
  heading: {
    marginTop: 4,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    lineHeight: 28,
  },
  body: { marginTop: 8, color: colors.muted, fontSize: 15, lineHeight: 21, fontWeight: '600' },
  controlRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gatedRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  hintChip: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.yellow,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(223,175,63,0.16)',
  },
  hintChipText: { color: colors.black, fontSize: 12.5, fontWeight: '700' },
  skipLink: { color: colors.muted, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  nextButton: {
    minWidth: 104,
    minHeight: 46,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: colors.black,
  },
  nextButtonText: { color: colors.buttonText, fontFamily: 'BebasNeue_400Regular', fontSize: 20 },
});
