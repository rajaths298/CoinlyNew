import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appColors as colors } from '../../theme';

type Props = {
  visible: boolean;
  gameTitle: string;
  onYes: () => void;
  onSkip: () => void;
};

/** First-visit (and replay) offer. Themed card, not a system alert. */
export default function TutorialEntryModal({ visible, gameTitle, onYes, onSkip }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSkip}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>NEW HERE?</Text>
          <Text style={styles.title}>Want a quick tutorial?</Text>
          <Text style={styles.body}>
            I&apos;ll walk you through your first round of {gameTitle} — hands-on, one step at a time.
          </Text>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onYes}>
            <Text style={styles.primaryButtonText}>YES, SHOW ME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.82} onPress={onSkip}>
            <Text style={styles.secondaryButtonText}>SKIP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,36,29,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 12,
    padding: 22,
  },
  eyebrow: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  title: {
    marginTop: 6,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    lineHeight: 34,
  },
  body: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 20,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: colors.black,
  },
  primaryButtonText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  secondaryButton: {
    marginTop: 12,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.black,
  },
  secondaryButtonText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
  },
});
