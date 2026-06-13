// Flat SVG donut for the Budget tab — spending breakdown and portfolio allocation.
// Pure and stateless: pass weighted segments and it draws one arc per segment around
// a track circle. Matches the app's flat card aesthetic (no gradients/shadows).

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { appColors as colors } from '../../theme';

export type DonutSegment = {
  value: number;
  color: string;
  label: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
};

const TRACK_COLOR = '#E7DDC8';

export default function DonutChart({
  segments,
  size = 168,
  strokeWidth = 26,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0);

  // Build cumulative arcs. With nothing to show we still render the track so the
  // chart never collapses to an empty box.
  let offsetSoFar = 0;
  const arcs = total > 0
    ? segments
        .filter((segment) => segment.value > 0)
        .map((segment) => {
          const fraction = segment.value / total;
          const dash = fraction * circumference;
          const arc = {
            key: segment.label,
            color: segment.color,
            dashArray: `${dash} ${circumference - dash}`,
            // Negative offset advances the arc clockwise from where the last one ended.
            dashOffset: -offsetSoFar,
          };
          offsetSoFar += dash;
          return arc;
        })
    : [];

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Rotate so arcs begin at 12 o'clock instead of 3 o'clock. */}
        <G rotation={-90} origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={TRACK_COLOR}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {arcs.map((arc) => (
            <Circle
              key={arc.key}
              cx={center}
              cy={center}
              r={radius}
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              strokeLinecap="butt"
              fill="none"
            />
          ))}
        </G>
      </Svg>
      {(centerValue || centerLabel) ? (
        <View style={styles.center} pointerEvents="none">
          {centerValue ? <Text style={styles.centerValue}>{centerValue}</Text> : null}
          {centerLabel ? <Text style={styles.centerLabel}>{centerLabel}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 28,
    includeFontPadding: false,
  },
  centerLabel: {
    marginTop: 2,
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 13,
  },
});
