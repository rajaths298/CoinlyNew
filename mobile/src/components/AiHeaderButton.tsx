import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { appColors as colors } from '../theme';

type Props = {
  onPress: () => void;
};

export default function AiHeaderButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.78} onPress={onPress}>
      <Text style={styles.text}>Coinly AI</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 116,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15803D',
    borderWidth: 2,
    borderColor: colors.black,
    paddingHorizontal: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 3,
  },
  text: {
    color: colors.white,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    includeFontPadding: false,
  },
});
