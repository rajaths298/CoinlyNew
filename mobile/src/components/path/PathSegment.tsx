import React from 'react';
import { StyleSheet, View } from 'react-native';
import { appColors as colors } from '../../theme';

type Props = {
  completed: boolean;
};

export default function PathSegment({ completed }: Props) {
  return (
    <View style={[styles.segment, completed ? styles.completed : styles.locked]} />
  );
}

const styles = StyleSheet.create({
  segment: {
    width: 4,
    height: 32,
    marginVertical: 2,
    borderRadius: 2,
    alignSelf: 'center',
  },
  completed: {
    backgroundColor: colors.positive,
  },
  locked: {
    backgroundColor: colors.black,
    opacity: 0.18,
  },
});
