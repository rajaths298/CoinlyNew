import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { TapToOrderExercise } from '../../types/learn';

type Props = {
  exercise: TapToOrderExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function TapToOrderView({ exercise, onAnswer, answered }: Props) {
  const [shuffled] = useState(() => [...exercise.items].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<string[]>([]);

  const unselected = shuffled.filter((item) => !selected.includes(item.id));
  const allSelected = selected.length === exercise.items.length;

  function handleAdd(itemId: string) {
    if (answered) return;
    setSelected((prev) => [...prev, itemId]);
  }

  function handleRemove(itemId: string) {
    if (answered) return;
    setSelected((prev) => prev.filter((id) => id !== itemId));
  }

  function handleCheck() {
    if (!allSelected || answered) return;
    const isCorrect = selected.every((id, i) => {
      const item = exercise.items.find((it) => it.id === id);
      return item?.rank === i + 1;
    });
    onAnswer(isCorrect);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.instruction}>{exercise.instruction}</Text>

      {/* Ordered slots */}
      <View style={styles.orderedList}>
        {selected.map((id, i) => {
          const item = exercise.items.find((it) => it.id === id);
          const isRight = answered && item?.rank === i + 1;
          const isWrong = answered && item?.rank !== i + 1;
          return (
            <TouchableOpacity
              key={id}
              style={[styles.orderedItem, isRight && styles.itemCorrect, isWrong && styles.itemWrong]}
              onPress={() => handleRemove(id)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={styles.rank}>{i + 1}</Text>
              <Text style={styles.itemText}>{item?.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Unplaced items */}
      {unselected.length > 0 && (
        <View style={styles.pool}>
          <Text style={styles.poolLabel}>TAP TO ADD</Text>
          {unselected.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.poolItem}
              onPress={() => handleAdd(item.id)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={styles.itemText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {allSelected && !answered && (
        <TouchableOpacity style={styles.checkBtn} onPress={handleCheck} activeOpacity={0.85}>
          <Text style={styles.checkBtnText}>CHECK ORDER</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  instruction: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10241D',
    lineHeight: 26,
  },
  orderedList: { gap: 8 },
  orderedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10241D',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    gap: 12,
  },
  itemCorrect: { borderColor: '#1F7A3D', backgroundColor: '#D4EDDA' },
  itemWrong: { borderColor: '#A33A2F', backgroundColor: '#F8D7DA' },
  rank: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10241D',
    width: 22,
    textAlign: 'center',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10241D',
    flex: 1,
    lineHeight: 20,
  },
  pool: { gap: 8 },
  poolLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B745F',
    letterSpacing: 1,
  },
  poolItem: {
    borderWidth: 2,
    borderColor: '#D0CCB8',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8F5E8',
  },
  checkBtn: {
    backgroundColor: '#10241D',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 1,
  },
});
