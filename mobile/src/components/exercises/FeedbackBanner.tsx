import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { askExerciseExplanation } from '../../services/aiAdvisor';

type FeedbackState = 'idle' | 'correct' | 'incorrect';
type ExplainState = 'idle' | 'loading' | 'done' | 'error';

type Props = {
  state: FeedbackState;
  rationale: string;
  explainContext?: string;
  onContinue: () => void;
};

export default function FeedbackBanner({ state, rationale, explainContext, onContinue }: Props) {
  const slideAnim = useRef(new Animated.Value(120)).current;
  const [explainState, setExplainState] = useState<ExplainState>('idle');
  const [explanation, setExplanation] = useState('');
  const abortRef = useRef<AbortController | null>(null);

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
      // Reset explain state when banner hides so it's fresh next time
      setExplainState('idle');
      setExplanation('');
    }
  }, [state, slideAnim]);

  // Cancel any in-flight AI request when unmounted
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  if (state === 'idle') return null;

  const isCorrect = state === 'correct';

  async function handleExplain() {
    if (!explainContext || explainState !== 'idle') return;
    const controller = new AbortController();
    abortRef.current = controller;
    setExplainState('loading');
    try {
      const result = await askExerciseExplanation(explainContext, 8000);
      if (!controller.signal.aborted) {
        setExplainState('done');
        setExplanation(result);
      }
    } catch {
      if (!controller.signal.aborted) {
        setExplainState('error');
      }
    }
  }

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

      {/* Explain My Answer section */}
      {explainContext ? (
        <View style={styles.explainArea}>
          {explainState === 'idle' && (
            <TouchableOpacity onPress={handleExplain} activeOpacity={0.7}>
              <Text style={styles.explainTrigger}>Why? Explain this →</Text>
            </TouchableOpacity>
          )}
          {explainState === 'loading' && (
            <Text style={styles.explainLoading}>Thinking...</Text>
          )}
          {explainState === 'done' && explanation ? (
            <View style={styles.explanationBox}>
              <View style={styles.explanationBorder} />
              <Text style={styles.explanationText}>{explanation}</Text>
            </View>
          ) : null}
          {explainState === 'error' && (
            <Text style={styles.explainError}>Could not load explanation.</Text>
          )}
        </View>
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
  explainArea: {
    marginTop: 2,
  },
  explainTrigger: {
    fontSize: 12,
    color: '#6B745F',
    fontWeight: '600',
  },
  explainLoading: {
    fontSize: 12,
    color: '#6B745F',
    fontStyle: 'italic',
  },
  explanationBox: {
    flexDirection: 'row',
    gap: 10,
  },
  explanationBorder: {
    width: 2,
    backgroundColor: '#6B745F',
    borderRadius: 1,
    opacity: 0.4,
  },
  explanationText: {
    flex: 1,
    fontSize: 13,
    color: '#6B745F',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  explainError: {
    fontSize: 12,
    color: '#6B745F',
    opacity: 0.7,
  },
});
