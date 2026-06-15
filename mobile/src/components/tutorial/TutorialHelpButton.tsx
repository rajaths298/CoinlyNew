import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { appColors as colors } from '../../theme';

type Props = {
  onPress: () => void;
};

/** Compact header "?" that replays the tutorial. Mirrors AiHeaderButton styling. */
export default function TutorialHelpButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.78}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Replay tutorial"
    >
      <Text style={styles.text}>?</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 3,
  },
  text: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    includeFontPadding: false,
  },
});
