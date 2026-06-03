import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appColors as colors } from '../../theme';
import { ICON } from '../ui/icons';
import type { PathNodeState, PathNodeType } from '../../types/learn';

const NODE_ICONS: Record<PathNodeType, string> = {
  lesson:    ICON.star,
  practice:  ICON.circle,
  chest:     ICON.box,
  guidebook: ICON.lines,
  trophy:    ICON.trophy,
};

type Props = {
  nodeId: string;
  type: PathNodeType;
  state: PathNodeState;
  onPress: () => void;
  label?: string;
};

export default function PathNodeButton({ type, state, onPress, label }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'active') {
      Animated.loop(
        Animated.sequence([
          Animated.spring(scaleAnim, { toValue: 1.08, useNativeDriver: true, speed: 3, bounciness: 10 }),
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 3, bounciness: 10 }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [state, scaleAnim]);

  const isLocked = state === 'locked';
  const isCompleted = state === 'completed';
  const isActive = state === 'active';

  const containerStyle = [
    styles.node,
    isCompleted && styles.nodeCompleted,
    isActive && styles.nodeActive,
    !isCompleted && !isActive && !isLocked && styles.nodeAvailable,
    isLocked && styles.nodeLocked,
  ];

  const iconColor = isCompleted ? colors.white : isActive ? colors.black : isLocked ? colors.black : colors.black;

  return (
    <View style={styles.wrapper}>
      {isActive && (
        <View style={styles.callout}>
          <Text style={styles.calloutText}>START</Text>
        </View>
      )}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={containerStyle}
          onPress={onPress}
          disabled={isLocked}
          activeOpacity={0.8}
        >
          <Text style={[styles.icon, { color: iconColor }, isLocked && styles.iconLocked]}>
            {isCompleted ? ICON.check : NODE_ICONS[type]}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      {label ? (
        <Text style={[styles.label, isLocked && styles.labelLocked]} numberOfLines={2}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  node: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  nodeCompleted: {
    backgroundColor: colors.positive,
    borderColor: colors.positive,
  },
  nodeActive: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  nodeAvailable: {
    backgroundColor: colors.white,
    borderColor: colors.black,
  },
  nodeLocked: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    opacity: 0.35,
    borderStyle: 'dashed',
  },
  icon: {
    fontSize: 26,
    includeFontPadding: false,
  },
  iconLocked: {
    opacity: 0.5,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.black,
    maxWidth: 84,
  },
  labelLocked: {
    opacity: 0.5,
  },
  callout: {
    backgroundColor: colors.black,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  calloutText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.yellow,
    letterSpacing: 1,
  },
});
