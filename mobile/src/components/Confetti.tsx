import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const COLORS = ['#F5C142', '#56AA59', '#4C9BE8', '#E87C4C', '#BE4C7A', '#fff'];
const COUNT = 30;

type Piece = {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  color: string;
  size: number;
};

export default function Confetti() {
  const pieces = useRef<Piece[]>(
    Array.from({ length: COUNT }, () => ({
      x: new Animated.Value(Math.random() * W),
      y: new Animated.Value(-20),
      rotate: new Animated.Value(0),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      size: 8 + Math.random() * 8,
    })),
  ).current;

  useEffect(() => {
    const animations = pieces.map((piece) => {
      const delay = Math.random() * 400;
      const duration = 1200 + Math.random() * 800;
      return Animated.parallel([
        Animated.timing(piece.y, {
          toValue: H + 20,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotate, {
          toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(piece.x, {
          toValue: (piece.x as unknown as { _value: number })._value + (Math.random() - 0.5) * 120,
          duration,
          delay,
          useNativeDriver: true,
        }),
      ]);
    });
    Animated.stagger(20, animations).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            borderRadius: 2,
            backgroundColor: piece.color,
            transform: [
              { translateX: piece.x },
              { translateY: piece.y },
              {
                rotate: piece.rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}
