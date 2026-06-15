import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { appColors as c } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import * as cloudSync from '../services/cloudSync';
import type { LessonProgress } from '../types/lesson';

type Props = {
  lessonProgress: LessonProgress;
  displayName: string;
  onBack: () => void;
  onDisplayNameChange: (name: string) => void;
};

function formatJoinDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function ProfileScreen({ lessonProgress, displayName, onBack, onDisplayNameChange }: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold, BebasNeue_400Regular });
  const { user, signOut } = useAuth();

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (!fontsLoaded) return null;

  const email = user?.email ?? '—';
  const joined = formatJoinDate(user?.created_at);
  const initial = (displayName || email || '?').trim().charAt(0).toUpperCase();

  const handleSaveName = async () => {
    const trimmed = draftName.trim();
    if (!trimmed || trimmed === displayName) { setEditing(false); return; }
    setSaving(true);
    await cloudSync.saveDisplayName(trimmed);
    setSaving(false);
    setEditing(false);
    onDisplayNameChange(trimmed);
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    cloudSync.clearActiveUser();
    await signOut(); // auth gate swaps back to the welcome flow automatically
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.back}>BACK</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.identity}>
            {editing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.nameInput}
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder="Your name"
                  placeholderTextColor={c.muted}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                  maxLength={40}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName} disabled={saving} activeOpacity={0.85}>
                  {saving ? <ActivityIndicator color={c.black} /> : <Text style={styles.saveBtnText}>SAVE</Text>}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.editRow}>
                <Text style={styles.name} numberOfLines={1}>{displayName || 'Set your name'}</Text>
                <TouchableOpacity onPress={() => { setDraftName(displayName); setEditing(true); }} activeOpacity={0.7}>
                  <Text style={styles.edit}>EDIT</Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Stat label="XP" value={String(lessonProgress.xp ?? 0)} />
          <View style={styles.statDivider} />
          <Stat label="STREAK" value={`${lessonProgress.streak ?? 0}`} />
          <View style={styles.statDivider} />
          <Stat label="BRAIN BUCKS" value={String(lessonProgress.brainBucks ?? 0)} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>MEMBER SINCE</Text>
          <Text style={styles.metaValue}>{joined}</Text>
        </View>

        <TouchableOpacity style={styles.signOut} onPress={handleSignOut} disabled={signingOut} activeOpacity={0.85}>
          {signingOut ? <ActivityIndicator color={c.negative} /> : <Text style={styles.signOutText}>SIGN OUT</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.green },
  content: { paddingHorizontal: 24 },
  back: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    letterSpacing: 1,
    color: c.muted,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 40,
    color: c.black,
    includeFontPadding: false,
    marginBottom: 24,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: c.yellow,
    borderWidth: 2,
    borderColor: c.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    color: c.black,
    includeFontPadding: false,
  },
  identity: { flex: 1 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: c.black,
    includeFontPadding: false,
  },
  nameInput: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: c.black,
    backgroundColor: c.white,
    borderWidth: 2,
    borderColor: c.black,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  edit: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    letterSpacing: 1,
    color: c.positive,
  },
  saveBtn: {
    backgroundColor: c.yellow,
    borderWidth: 2,
    borderColor: c.black,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 64,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    letterSpacing: 1,
    color: c.black,
  },
  email: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    letterSpacing: 0.5,
    color: c.muted,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: c.white,
    borderWidth: 2,
    borderColor: c.black,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, alignSelf: 'stretch', backgroundColor: c.black, opacity: 0.15 },
  statValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 26,
    color: c.black,
    includeFontPadding: false,
  },
  statLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 13,
    letterSpacing: 0.8,
    color: c.muted,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,36,29,0.12)',
    marginBottom: 28,
  },
  metaLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    letterSpacing: 0.8,
    color: c.muted,
  },
  metaValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: c.black,
    includeFontPadding: false,
  },
  signOut: {
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: c.negative,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.white,
  },
  signOutText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    letterSpacing: 1,
    color: c.negative,
  },
});
