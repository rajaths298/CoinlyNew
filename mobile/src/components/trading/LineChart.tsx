import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { appColors as colors } from '../../theme';
import type { PricePoint } from '../../types/trading';

type Props = {
  points: PricePoint[];
  width: number;
  height?: number;
  showLabels?: boolean;
};

function pointsToPath(pts: PricePoint[], w: number, h: number): string {
  if (pts.length < 2) return '';
  const prices = pts.map((p) => p.close);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pad = h * 0.06; // small vertical padding inside the chart

  const cx = (i: number) => ((i / (pts.length - 1)) * w).toFixed(2);
  const cy = (p: number) => (h - pad - ((p - min) / range) * (h - pad * 2)).toFixed(2);

  return pts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${cx(i)},${cy(pt.close)}`).join(' ');
}

function pointsToFillPath(pts: PricePoint[], w: number, h: number): string {
  const line = pointsToPath(pts, w, h);
  if (!line) return '';
  return `${line} L${w.toFixed(2)},${h.toFixed(2)} L0,${h.toFixed(2)} Z`;
}

export default function LineChart({ points, width, height = 120, showLabels = true }: Props) {
  const data = useMemo(() => {
    if (points.length === 0) return null;
    const prices = points.map((p) => p.close);
    const first = prices[0]!;
    const last = prices[prices.length - 1]!;
    const isUp = last >= first;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { isUp, min, max, first, last, linePath: pointsToPath(points, width, height), fillPath: pointsToFillPath(points, width, height) };
  }, [points, width, height]);

  if (!data || points.length < 2) {
    return (
      <View style={[styles.empty, { width, height }]}>
        <Text style={styles.emptyText}>No chart data available</Text>
      </View>
    );
  }

  const stroke = data.isUp ? colors.positive : colors.negative;
  const gradId = data.isUp ? 'gradUp' : 'gradDown';
  const gradColor = data.isUp ? '#1F7A3D' : '#A33A2F';

  const labelH = showLabels ? 16 : 0;
  const svgH = height - labelH;

  const formatPrice = (p: number) =>
    p >= 1000 ? `$${(p / 1000).toFixed(1)}k` : `$${p.toFixed(p < 10 ? 2 : 0)}`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={svgH} viewBox={`0 0 ${width} ${svgH}`}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={gradColor} stopOpacity={0.22} />
            <Stop offset="100%" stopColor={gradColor} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Area fill */}
        <Path d={data.fillPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <Path
          d={data.linePath}
          stroke={stroke}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {showLabels && (
        <View style={[styles.labels, { width }]}>
          <Text style={styles.labelText}>{formatPrice(data.min)}</Text>
          <Text style={[styles.labelText, { color: stroke, fontWeight: '700' }]}>
            {formatPrice(data.last)}
          </Text>
          <Text style={styles.labelText}>{formatPrice(data.max)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F0DF',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 12,
    color: colors.muted,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 2,
  },
  labelText: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '500',
  },
});
