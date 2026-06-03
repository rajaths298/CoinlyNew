import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { CategorizeExercise } from '../../types/learn';

type Props = {
  exercise: CategorizeExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function CategorizeView({ exercise, onAnswer, answered }: Props) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const assignedItemIds = new Set(Object.keys(assignments));
  const allAssigned = assignedItemIds.size === exercise.items.length;

  function handleItemPress(itemId: string) {
    if (answered || assignedItemIds.has(itemId)) return;
    setSelectedItem(itemId === selectedItem ? null : itemId);
  }

  function handleBucketPress(bucketId: string) {
    if (!selectedItem || answered) return;
    setAssignments((prev) => ({ ...prev, [selectedItem]: bucketId }));
    setSelectedItem(null);
  }

  function handleCheck() {
    if (!allAssigned || answered) return;
    const isCorrect = exercise.items.every((item) => assignments[item.id] === item.bucketId);
    onAnswer(isCorrect);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.instruction}>{exercise.instruction}</Text>
      {selectedItem && (
        <Text style={styles.hint}>Now tap a bucket to assign it</Text>
      )}

      {/* Buckets */}
      <View style={styles.buckets}>
        {exercise.buckets.map((bucket) => {
          const bucketItems = exercise.items.filter((item) => assignments[item.id] === bucket.id);
          return (
            <TouchableOpacity
              key={bucket.id}
              style={[styles.bucket, selectedItem && styles.bucketActive]}
              onPress={() => handleBucketPress(bucket.id)}
              activeOpacity={0.85}
              disabled={!selectedItem || answered}
            >
              <Text style={styles.bucketLabel}>{bucket.label}</Text>
              <View style={styles.bucketItems}>
                {bucketItems.map((item) => (
                  <View key={item.id} style={[
                    styles.bucketChip,
                    answered && item.bucketId === assignments[item.id] ? styles.chipCorrect : answered ? styles.chipWrong : null,
                  ]}>
                    <Text style={styles.bucketChipText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Unassigned items */}
      <View style={styles.itemPool}>
        {exercise.items
          .filter((item) => !assignedItemIds.has(item.id))
          .map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.chip, selectedItem === item.id && styles.chipSelected]}
              onPress={() => handleItemPress(item.id)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selectedItem === item.id && styles.chipTextSelected]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      {allAssigned && !answered && (
        <TouchableOpacity style={styles.checkBtn} onPress={handleCheck} activeOpacity={0.85}>
          <Text style={styles.checkBtnText}>CHECK</Text>
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
  hint: {
    fontSize: 13,
    color: '#6B745F',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  buckets: {
    flexDirection: 'row',
    gap: 10,
  },
  bucket: {
    flex: 1,
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#D0CCB8',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#F8F5E8',
    gap: 8,
  },
  bucketActive: {
    borderColor: '#F5C142',
    borderStyle: 'dashed',
  },
  bucketLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10241D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bucketItems: {
    gap: 4,
  },
  bucketChip: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#D0CCB8',
  },
  chipCorrect: {
    backgroundColor: '#D4EDDA',
    borderColor: '#1F7A3D',
  },
  chipWrong: {
    backgroundColor: '#F8D7DA',
    borderColor: '#A33A2F',
  },
  bucketChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10241D',
  },
  itemPool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 2,
    borderColor: '#10241D',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#F5C142',
    borderColor: '#F5C142',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10241D',
  },
  chipTextSelected: {
    color: '#10241D',
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
