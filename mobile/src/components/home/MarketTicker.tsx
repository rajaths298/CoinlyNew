import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appColors as colors } from '../../theme';
import { ICON } from '../ui/icons';
import type { MarketAsset } from '../../services/marketData';
import type { MarketStatus } from './homeInsights';

type Props = {
  assets: MarketAsset[];
  status: MarketStatus;
  lastUpdated: string | null;
  onPress?: () => void;
};

const SCROLL_SPEED_PX_PER_SEC = 32;

export default function MarketTicker({ assets, status, lastUpdated, onPress }: Props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);

  // Seamless marquee: two copies of the strip side by side, translate by one
  // copy's width, then the loop reset lands on identical pixels.
  useEffect(() => {
    if (contentWidth <= 0 || status === 'loading') return;
    scrollX.setValue(0);
    const loop = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -contentWidth,
        duration: (contentWidth / SCROLL_SPEED_PX_PER_SEC) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [contentWidth, status, scrollX]);

  if (status === 'loading') {
    return (
      <View style={styles.strip}>
        <View style={styles.skeletonRow}>
          {Array.from({ length: 4 }, (_, index) => (
            <View key={index} style={styles.cell}>
              <View style={[styles.skeleton, { width: 34 }]} />
              <View style={[styles.skeleton, { width: 52 }]} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  const stamp = status === 'fallback'
    ? 'DEMO DATA'
    : lastUpdated
      ? `AS OF ${lastUpdated.toUpperCase()}`
      : '';

  const copy = (measure: boolean) => (
    <View
      style={styles.copyRow}
      onLayout={measure ? (event) => {
        const width = Math.round(event.nativeEvent.layout.width);
        // Only restart the loop when the width actually changes — data
        // refreshes re-render but shouldn't jump the scroll position.
        setContentWidth((current) => (current === width ? current : width));
      } : undefined}
    >
      {assets.map((asset) => (
        <TickerCell key={asset.id} asset={asset} />
      ))}
      {stamp ? (
        <View style={styles.cell}>
          <Text style={styles.stampText}>{stamp}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <TouchableOpacity style={styles.strip} activeOpacity={0.85} onPress={onPress}>
      <Animated.View style={[styles.marquee, { transform: [{ translateX: scrollX }] }]}>
        {copy(true)}
        {copy(false)}
      </Animated.View>
    </TouchableOpacity>
  );
}

function TickerCell({ asset }: { asset: MarketAsset }) {
  const change = asset.changePercent;
  const isUp = (change ?? 0) >= 0;

  // Flash the cell green/red when a refresh moves the price.
  const flash = useRef(new Animated.Value(0)).current;
  const prevPrice = useRef(asset.price);
  const [flashColor, setFlashColor] = useState<string>(colors.positive);
  useEffect(() => {
    if (prevPrice.current === asset.price) return;
    setFlashColor(asset.price > prevPrice.current ? colors.positive : colors.negative);
    prevPrice.current = asset.price;
    flash.setValue(0.28);
    Animated.timing(flash, {
      toValue: 0,
      duration: 1100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [asset.price, flash]);

  return (
    <View style={styles.cell}>
      <Animated.View
        pointerEvents="none"
        style={[styles.flashOverlay, { backgroundColor: flashColor, opacity: flash }]}
      />
      <Text style={[styles.symbol, asset.isFallback && styles.symbolMuted]}>{asset.symbol}</Text>
      <Text style={styles.price}>{formatTickerPrice(asset.price)}</Text>
      <Text style={[styles.change, isUp ? styles.changeUp : styles.changeDown]}>
        {change === undefined
          ? '--'
          : `${isUp ? ICON.up : ICON.down}${Math.abs(change).toFixed(2)}%`}
      </Text>
      <View style={styles.divider} />
    </View>
  );
}

function formatTickerPrice(value: number) {
  return `$${value.toLocaleString(undefined, {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
  })}`;
}

const styles = StyleSheet.create({
  strip: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  marquee: {
    flexDirection: 'row',
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingLeft: 12,
  },
  divider: {
    alignSelf: 'stretch',
    width: 1,
    marginLeft: 12,
    backgroundColor: 'rgba(107, 116, 95, 0.35)',
  },
  flashOverlay: {
    position: 'absolute',
    top: -9,
    bottom: -9,
    left: 4,
    right: 4,
    borderRadius: 4,
  },
  symbol: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    color: colors.black,
    letterSpacing: 0.5,
  },
  symbolMuted: {
    color: colors.muted,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.black,
    fontVariant: ['tabular-nums'],
  },
  change: {
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  changeUp: {
    color: colors.positive,
  },
  changeDown: {
    color: colors.negative,
  },
  stampText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 0.8,
  },
  skeleton: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(107, 116, 95, 0.25)',
  },
});
