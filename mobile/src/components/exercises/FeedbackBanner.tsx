import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FeedbackState = 'idle' | 'correct' | 'incorrect';

type Props = {
  state: FeedbackState;
  rationale: string;
  onContinue: () => void;
};

export default function FeedbackBanner({ state, rationale, onContinue }: Props) {
  const slideAnim = useRef(new Animated.Value(120)).current;

  useEffect(() => {
    if (state !== 'idle') {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      slideAnim.setValue(120);
    }
  }, [state, slideAnim]);

  if (state === 'idle') return null;

  const isCorrect = state === 'correct';

  return (
    <Animated.View
      style={[
        styles.banner,
        isCorrect ? styles.correctBanner : styles.incorrectBanner,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusIcon}>{isCorrect ? '✓' : '✗'}</Text>
          <Text style={[styles.statusText, isCorrect ? styles.correctText : styles.incorrectText]}>
            {isCorrect ? 'Correct!' : 'Not quite'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.continueBtn, isCorrect ? styles.correctBtn : styles.incorrectBtn]}
          onPress={onContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>
            {isCorrect ? 'CONTINUE' : 'GOT IT'}
          </Text>
        </TouchableOpacity>
      </View>
      {rationale ? (
        <Text style={[styles.rationale, isCorrect ? styles.correctRationale : styles.incorrectRationale]}>
          {rationale}
        </Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 10,
  },
  correctBanner: {
    backgroundColor: '#D4EDDA',
    borderTopWidth: 2,
    borderTopColor: '#1F7A3D',
  },
  incorrectBanner: {
    backgroundColor: '#F8D7DA',
    borderTopWidth: 2,
    borderTopColor: '#A33A2F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusText: {
    fontSize: 17,
    fontWeight: '800',
  },
  correctText: {
    color: '#1F7A3D',
  },
  incorrectText: {
    color: '#A33A2F',
  },
  continueBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  correctBtn: {
    backgroundColor: '#1F7A3D',
  },
  incorrectBtn: {
    backgroundColor: '#A33A2F',
  },
  continueBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  rationale: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  correctRationale: {
    color: '#155724',
  },
  incorrectRationale: {
    color: '#721C24',
  },
});
