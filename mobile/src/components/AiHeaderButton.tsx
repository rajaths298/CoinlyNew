import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appColors as colors } from '../theme';
import { ICON } from './ui/icons';

type Props = {
  // Retained for compatibility with callers; the feature is locked, so the
  // handler is intentionally ignored until Coinly AI is re-enabled.
  onPress?: () => void;
};

/**
 * Coinly AI is temporarily locked ("Coming Soon"). The button stays visible on
 * every screen but no longer opens the assistant — tapping shows a brief inline
 * notice instead. The underlying AI code is untouched; only this entry point is
 * disabled, so it can be re-enabled later by restoring the onPress wiring.
 */
export default function AiHeaderButton(_props: Props) {
  const [showNotice, setShowNotice] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const handlePress = () => {
    setShowNotice(true);
    Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }).start();
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setShowNotice(false);
      });
    }, 1900);
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Coinly AI, coming soon"
        accessibilityState={{ disabled: true }}
      >
        <View style={styles.row}>
          <Text style={styles.lock}>{ICON.lock}</Text>
          <Text style={styles.text}>Coinly AI</Text>
        </View>
        <Text style={styles.soon}>COMING SOON</Text>
      </TouchableOpacity>

      {showNotice ? (
        <Animated.View style={[styles.toast, { opacity }]} pointerEvents="none">
          <Text style={styles.toastText}>Coinly AI — Coming Soon</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  button: {
    minWidth: 116,
    minHeight: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    // Subdued "locked" treatment: pale green fill instead of the live green CTA.
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lock: {
    color: colors.muted,
    fontSize: 13,
    includeFontPadding: false,
  },
  text: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    includeFontPadding: false,
  },
  soon: {
    marginTop: 1,
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 10,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  toast: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 50,
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
  },
  toastText: {
    color: colors.white,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
});
