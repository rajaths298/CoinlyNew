import React, { useCallback, useRef, useState } from 'react';
import {
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { G, Line, Polyline, Rect, Svg, Text as SvgText } from 'react-native-svg';
import type { SliderPlaygroundExercise } from '../../types/learn';

// ─── Formula engine (mirrors CalculatorView) ────────────────────────────────

export function calcResult(formulaKey: string, values: Record<string, number>): number {
  switch (formulaKey) {
    case 'opportunityCost':
    case 'compoundGrowth': {
      const p = values['principal'] ?? 1000;
      const r = (values['rate'] ?? 7) / 100;
      const n = values['years'] ?? 10;
      return Math.round(p * Math.pow(1 + r, n));
    }
    case 'emergencyFund': {
      const rent = values['rent'] ?? 0;
      const food = values['food'] ?? 0;
      const utilities = values['utilities'] ?? 0;
      const transport = values['transport'] ?? 0;
      const months = values['months'] ?? 6;
      return Math.round((rent + food + utilities + transport) * months);
    }
    case 'budgetSurplus':
    case 'budgetBalance': {
      const income = values['income'] ?? 0;
      const expenses =
        (values['expenses'] ?? 0) +
        (values['fixed'] ?? 0) +
        (values['variable'] ?? 0);
      return Math.round(income - expenses);
    }
    case 'loanPayment': {
      const principal = values['principal'] ?? 1000;
      const r = (values['rate'] ?? 5) / 100 / 12;
      const n = values['months'] ?? 12;
      if (r === 0) return Math.round(principal / n);
      return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }
    case 'savingsGoal': {
      const goal = values['goal'] ?? 0;
      const n = Math.max(1, values['months'] ?? 12);
      const annualRate = values['rate'] ?? 0;
      const r = annualRate / 100 / 12;
      if (r === 0) return Math.round(goal / n);
      return Math.round((goal * r) / (Math.pow(1 + r, n) - 1));
    }
    case 'annualCost': {
      const daily = values['daily'] ?? 0;
      const days = values['days'] ?? 365;
      const years = values['years'] ?? 1;
      return Math.round(daily * days * years);
    }
    default:
      return 0;
  }
}

// ─── Snap a value to the nearest step ───────────────────────────────────────

function snap(value: number, min: number, max: number, step: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  return Math.round((clamped - min) / step) * step + min;
}

// ─── Graph component ────────────────────────────────────────────────────────

const GRAPH_H = 180;
const GRAPH_PADDING = { top: 12, right: 8, bottom: 28, left: 48 };
const GRAPH_STEPS = 60;
const GRID_COLOR = '#E8E4D4';
const CURVE_COLOR = '#10241D';
const MARKER_COLOR = '#F5C142';

type GraphProps = {
  formulaKey: string;
  values: Record<string, number>;
  xInputId: string;
  xMin: number;
  xMax: number;
  xStep: number;
  xLabel: string;
  yLabel: string;
  width: number;
};

function Graph({ formulaKey, values, xInputId, xMin, xMax, xStep, xLabel, yLabel, width }: GraphProps) {
  const innerW = width - GRAPH_PADDING.left - GRAPH_PADDING.right;
  const innerH = GRAPH_H - GRAPH_PADDING.top - GRAPH_PADDING.bottom;

  // Sweep x across full range to compute y values
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= GRAPH_STEPS; i++) {
    const xVal = xMin + (i / GRAPH_STEPS) * (xMax - xMin);
    const snapped = snap(xVal, xMin, xMax, xStep);
    const y = calcResult(formulaKey, { ...values, [xInputId]: snapped });
    points.push({ x: xVal, y });
  }

  const yMin = Math.min(...points.map((p) => p.y));
  const yMax = Math.max(...points.map((p) => p.y));
  const yRange = yMax - yMin || 1;

  function toSvgX(xVal: number) {
    return GRAPH_PADDING.left + ((xVal - xMin) / (xMax - xMin)) * innerW;
  }

  function toSvgY(yVal: number) {
    return GRAPH_PADDING.top + innerH - ((yVal - yMin) / yRange) * innerH;
  }

  const polylinePoints = points.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ');

  // Current x marker
  const curX = values[xInputId] ?? xMin;
  const curY = calcResult(formulaKey, values);
  const markerSvgX = toSvgX(curX);
  const markerSvgY = toSvgY(curY);

  // Y axis tick labels (3 ticks: min, mid, max)
  function fmtY(v: number) {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v}`;
  }

  const yTicks = [yMin, yMin + yRange * 0.5, yMax];

  return (
    <Svg width={width} height={GRAPH_H} style={styles.graph}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((frac) => (
        <Line
          key={frac}
          x1={GRAPH_PADDING.left}
          y1={GRAPH_PADDING.top + innerH * (1 - frac)}
          x2={GRAPH_PADDING.left + innerW}
          y2={GRAPH_PADDING.top + innerH * (1 - frac)}
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
      ))}

      {/* Axes */}
      <Line
        x1={GRAPH_PADDING.left}
        y1={GRAPH_PADDING.top}
        x2={GRAPH_PADDING.left}
        y2={GRAPH_PADDING.top + innerH}
        stroke={GRID_COLOR}
        strokeWidth={1.5}
      />
      <Line
        x1={GRAPH_PADDING.left}
        y1={GRAPH_PADDING.top + innerH}
        x2={GRAPH_PADDING.left + innerW}
        y2={GRAPH_PADDING.top + innerH}
        stroke={GRID_COLOR}
        strokeWidth={1.5}
      />

      {/* Y axis tick labels */}
      {yTicks.map((v, i) => (
        <SvgText
          key={i}
          x={GRAPH_PADDING.left - 4}
          y={toSvgY(v) + 4}
          fontSize={9}
          fill="#6B745F"
          textAnchor="end"
        >
          {fmtY(v)}
        </SvgText>
      ))}

      {/* Axis labels */}
      <SvgText
        x={GRAPH_PADDING.left + innerW / 2}
        y={GRAPH_H - 4}
        fontSize={9}
        fill="#6B745F"
        textAnchor="middle"
      >
        {xLabel}
      </SvgText>

      {/* Curve */}
      <Polyline
        points={polylinePoints}
        fill="none"
        stroke={CURVE_COLOR}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Current x vertical rule */}
      <Line
        x1={markerSvgX}
        y1={GRAPH_PADDING.top}
        x2={markerSvgX}
        y2={GRAPH_PADDING.top + innerH}
        stroke={MARKER_COLOR}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />

      {/* Current value dot */}
      <G>
        <Rect
          x={markerSvgX - 18}
          y={markerSvgY - 10}
          width={36}
          height={14}
          rx={4}
          fill={MARKER_COLOR}
        />
        <SvgText
          x={markerSvgX}
          y={markerSvgY + 1}
          fontSize={8}
          fill="#10241D"
          textAnchor="middle"
          fontWeight="700"
        >
          {fmtY(curY)}
        </SvgText>
      </G>
    </Svg>
  );
}

// ─── Custom slider ───────────────────────────────────────────────────────────

type SliderRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  disabled: boolean;
  onChange: (v: number) => void;
};

function SliderRow({ label, value, min, max, step, prefix, suffix, disabled, onChange }: SliderRowProps) {
  const trackWidthRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        if (disabled) return;
        const ratio = Math.min(1, Math.max(0, evt.nativeEvent.locationX / (trackWidthRef.current || 1)));
        onChange(snap(min + ratio * (max - min), min, max, step));
      },
      onPanResponderMove: (evt) => {
        if (disabled) return;
        const ratio = Math.min(1, Math.max(0, evt.nativeEvent.locationX / (trackWidthRef.current || 1)));
        onChange(snap(min + ratio * (max - min), min, max, step));
      },
    }),
  ).current;

  const fillRatio = max === min ? 0 : (value - min) / (max - min);

  return (
    <View style={sliderStyles.row}>
      <View style={sliderStyles.labelRow}>
        <Text style={sliderStyles.label}>{label}</Text>
        <Text style={sliderStyles.valueText}>
          {prefix ?? ''}{value.toLocaleString()}{suffix ?? ''}
        </Text>
      </View>

      <View
        style={sliderStyles.track}
        onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        <View style={[sliderStyles.fill, { width: `${fillRatio * 100}%` }]} />
        <View
          style={[
            sliderStyles.thumb,
            { left: `${fillRatio * 100}%` },
            disabled && sliderStyles.thumbDisabled,
          ]}
        />
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  row: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10241D',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10241D',
  },
  track: {
    height: 10,
    backgroundColor: '#E8E4D4',
    borderRadius: 5,
    overflow: 'visible',
    position: 'relative',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5C142',
    borderRadius: 5,
  },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10241D',
    borderWidth: 3,
    borderColor: '#F5C142',
    marginLeft: -11,
    top: -6,
  },
  thumbDisabled: {
    backgroundColor: '#6B745F',
    borderColor: '#D0CCB8',
  },
});

// ─── Main view ───────────────────────────────────────────────────────────────

type Props = {
  exercise: SliderPlaygroundExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function SliderPlaygroundView({ exercise, onAnswer, answered }: Props) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(exercise.inputs.map((inp) => [inp.id, inp.value])),
  );
  const [graphWidth, setGraphWidth] = useState(300);

  const result = calcResult(exercise.formulaKey, values);

  const xInput = exercise.inputs.find((inp) => inp.id === exercise.graph.xInputId);

  const handleChange = useCallback((id: string, v: number) => {
    if (answered) return;
    setValues((prev) => ({ ...prev, [id]: v }));
  }, [answered]);

  function fmtResult(v: number) {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
    return `$${v.toLocaleString()}`;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <Text style={styles.explanation}>{exercise.explanation}</Text>

      {/* SVG graph */}
      <View
        style={styles.graphContainer}
        onLayout={(e) => setGraphWidth(e.nativeEvent.layout.width)}
      >
        {xInput && (
          <Graph
            formulaKey={exercise.formulaKey}
            values={values}
            xInputId={exercise.graph.xInputId}
            xMin={xInput.min}
            xMax={xInput.max}
            xStep={xInput.step}
            xLabel={exercise.graph.xLabel}
            yLabel={exercise.graph.yLabel}
            width={graphWidth}
          />
        )}
      </View>

      {/* Live result */}
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>{exercise.targetLabel}</Text>
        <Text style={styles.resultValue}>{fmtResult(result)}</Text>
      </View>

      {/* Slider rows */}
      <View style={styles.slidersContainer}>
        {exercise.inputs.map((inp) => (
          <SliderRow
            key={inp.id}
            label={inp.label}
            value={values[inp.id] ?? inp.value}
            min={inp.min}
            max={inp.max}
            step={inp.step}
            prefix={inp.prefix}
            suffix={inp.suffix}
            disabled={answered || inp.min === inp.max}
            onChange={(v) => handleChange(inp.id, v)}
          />
        ))}
      </View>

      {!answered && (
        <TouchableOpacity style={styles.confirmBtn} onPress={() => onAnswer(true)} activeOpacity={0.85}>
          <Text style={styles.confirmBtnText}>CONFIRM</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  prompt: {
    fontSize: 17,
    fontWeight: '800',
    color: '#10241D',
    lineHeight: 26,
  },
  explanation: {
    fontSize: 13,
    color: '#6B745F',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  graphContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFDF4',
    borderWidth: 1.5,
    borderColor: '#D0CCB8',
  },
  graph: {
    alignSelf: 'stretch',
  },
  resultBox: {
    backgroundColor: '#F5C142',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 2,
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10241D',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#10241D',
  },
  slidersContainer: {
    gap: 20,
    borderWidth: 1.5,
    borderColor: '#D0CCB8',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFDF4',
  },
  confirmBtn: {
    backgroundColor: '#10241D',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 1,
  },
});
