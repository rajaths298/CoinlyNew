import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { GuidebookEntry, MasteryTier } from '../../types/learn';
import { ICON } from '../ui/icons';

type Props = {
  sectionIndex: number;
  unitIndex: number;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  guidebook: GuidebookEntry[];
  masteryTier: MasteryTier | null;
};

const TIER_LABEL: Record<MasteryTier, string> = {
  bronze: 'BRONZE',
  silver: 'SILVER',
  gold: 'GOLD',
  legendary: 'LEGENDARY',
};

export default function UnitHeader({
  sectionIndex,
  unitIndex,
  title,
  subtitle,
  color,
  icon,
  guidebook,
  masteryTier,
}: Props) {
  const [gbVisible, setGbVisible] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>
          SECTION {sectionIndex} · UNIT {unitIndex}
        </Text>
        {masteryTier ? (
          <Text style={styles.tier}>{TIER_LABEL[masteryTier]}</Text>
        ) : null}
      </View>
      <View style={styles.mainRow}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {guidebook.length > 0 && (
          <TouchableOpacity style={styles.gbButton} onPress={() => setGbVisible(true)}>
            <Text style={styles.gbButtonText}>{ICON.lines}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={gbVisible} animationType="slide" onRequestClose={() => setGbVisible(false)}>
        <View style={[styles.modalHeader, { backgroundColor: color }]}>
          <Text style={styles.modalTitle}>{icon} {title} — Guidebook</Text>
          <TouchableOpacity onPress={() => setGbVisible(false)}>
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalContent}>
          {guidebook.map((entry) => (
            <View key={entry.id} style={styles.gbEntry}>
              <Text style={styles.gbEntryTitle}>{entry.title}</Text>
              <Text style={styles.gbEntryBody}>{entry.body}</Text>
            </View>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1.5,
  },
  tier: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  gbButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gbButtonText: {
    fontSize: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
  },
  modalClose: {
    fontSize: 20,
    color: '#fff',
    padding: 8,
  },
  modalBody: {
    flex: 1,
    backgroundColor: '#FFFDF4',
  },
  modalContent: {
    padding: 20,
    gap: 20,
  },
  gbEntry: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E4D4',
  },
  gbEntryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10241D',
    marginBottom: 6,
  },
  gbEntryBody: {
    fontSize: 14,
    color: '#3D4D40',
    lineHeight: 20,
  },
});
