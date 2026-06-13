// Reusable micro-interaction primitives, all on the core Animated API (no
// reanimated dependency). Transform/opacity animations run on the native
// driver; AnimatedNumber re-renders text so it stays on the JS thread.

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

type FadeSlideInProps = {
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

// Entrance: fade up into place. Stagger siblings by passing increasing delays.
export function FadeSlideIn({ delay = 0, distance = 16, duration = 420, style, children }: FadeSlideInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

type PressableScaleProps = {
  onPress?: () => void;
  disabled?: boolean;
  activeScale?: number;
  // Layout styles (flexBasis etc.) go on the Pressable so flex rows distribute
  // correctly; visual styles go on the inner Animated.View that scales.
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

// Spring scale-down on press — the standard "this is tappable" micro-feedback.
export function PressableScale({
  onPress,
  disabled,
  activeScale = 0.965,
  style,
  innerStyle,
  children,
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: activeScale, speed: 40, bounciness: 0, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, speed: 24, bounciness: 7, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      style={style}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
    >
      <Animated.View style={[innerStyle, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

type PopInProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

// Spring from zero — checkmarks, badges, anything that just became true.
export function PopIn({ style, children }: PopInProps) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 160,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>;
}

type AnimatedNumberProps = {
  value: number;
  style?: StyleProp<TextStyle>;
  duration?: number;
  format?: (value: number) => string;
};

// Counts up to `value` on mount and rolls between values on change, with a
// small scale pop while the number moves.
export function AnimatedNumber({ value, style, duration = 700, format }: AnimatedNumberProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const displayedRef = useRef(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const from = displayedRef.current;
    if (from === value) {
      setDisplay(value);
      return;
    }
    progress.setValue(0);
    const listenerId = progress.addListener(({ value: t }) => {
      const next = Math.round(from + (value - from) * t);
      displayedRef.current = next;
      setDisplay(next);
    });
    const animation = Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // drives setState, not a style
      }),
      Animated.sequence([
        Animated.timing(pop, { toValue: 1.12, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(pop, { toValue: 1, friction: 5, tension: 180, useNativeDriver: true }),
      ]),
    ]);
    animation.start(() => progress.removeListener(listenerId));
    return () => {
      progress.removeListener(listenerId);
      animation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Animated.Text style={[style, { transform: [{ scale: pop }] }]}>
      {format ? format(display) : display.toLocaleString()}
    </Animated.Text>
  );
}
