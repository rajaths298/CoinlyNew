import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  buyPropertyDeal,
  buyPropertyUpgrade,
  continuePropertyTurn,
  createInitialPropertySession,
  finishPropertyTurn,
  getActivePropertyDeal,
  getCurrentPropertyTile,
  getMonthlyCashFlow,
  getPortfolioEquity,
  getPortfolioNetWorth,
  getPropertyUpgradeCost,
  getPropertyUpgradeLevel,
  movePropertyToken,
  normalizePropertySession,
  propertyBoardTiles,
  propertyUpgradeCatalog,
  resolvePropertyChoice,
  rollPropertyDice,
  skipPropertyDeal,
  toPropertyGameResult,
} from '../engine/propertyLadderEngine';
import { appColors as colors } from '../theme';
import type {
  GameDefinition,
  GameResult,
  PropertyChoice,
  PropertyChoiceOption,
  PropertyDeal,
  PropertyHolding,
  PropertySession,
  PropertyTile,
  PropertyTurnLedger,
  PropertyUpgradeId,
} from '../types/game';

type Props = {
  aiHeaderButton?: React.ReactNode;
  game: GameDefinition;
  propertySession?: PropertySession;
  onBack: () => void;
  onComplete: (result: GameResult) => void;
  onUpdatePropertySession?: (session: PropertySession) => void;
};

const tilePositions: Array<Pick<ViewStyle, 'left' | 'top'>> = [
  { left: '0%', top: '0%' },
  { left: '20%', top: '0%' },
  { left: '40%', top: '0%' },
  { left: '60%', top: '0%' },
  { left: '80%', top: '0%' },
  { left: '80%', top: '20%' },
  { left: '80%', top: '40%' },
  { left: '80%', top: '60%' },
  { left: '80%', top: '80%' },
  { left: '60%', top: '80%' },
  { left: '40%', top: '80%' },
  { left: '20%', top: '80%' },
  { left: '0%', top: '80%' },
  { left: '0%', top: '60%' },
  { left: '0%', top: '40%' },
  { left: '0%', top: '20%' },
];

export default function PropertyLadderScreen({
  aiHeaderButton,
  game,
  propertySession,
  onBack,
  onComplete,
  onUpdatePropertySession,
}: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold, BebasNeue_400Regular });
  const [session, setSession] = useState<PropertySession>(() => (
    normalizePropertySession(propertySession ?? createInitialPropertySession())
  ));
  const tokenPulse = useRef(new Animated.Value(0)).current;
  const completionLogged = useRef(false);
  const activeTile = getCurrentPropertyTile(session);
  const activeDeal = getActivePropertyDeal(session);
  const netWorth = getPortfolioNetWorth(session);
  const progressPct = Math.min(100, Math.max(4, (netWorth / session.targetNetWorth) * 100));

  useEffect(() => {
    onUpdatePropertySession?.(session);
  }, [onUpdatePropertySession, session]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(tokenPulse, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(tokenPulse, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [session.position, tokenPulse]);

  useEffect(() => {
    if (session.status === 'playing' || completionLogged.current) return;
    completionLogged.current = true;
    onComplete(toPropertyGameResult(session, game.competency));
  }, [game.competency, onComplete, session]);

  if (!fontsLoaded) return null;

  const roll = () => {
    const dice = rollPropertyDice(session);
    setSession((current) => movePropertyToken(current, dice));
  };

  const chooseDeal = (deal: PropertyDeal) => {
    setSession((current) => buyPropertyDeal(current, deal.id));
  };

  const passDeal = () => {
    setSession((current) => skipPropertyDeal(current));
  };

  const chooseEvent = (option: PropertyChoiceOption) => {
    setSession((current) => resolvePropertyChoice(current, option));
  };

  const chooseUpgrade = (upgradeId: PropertyUpgradeId) => {
    setSession((current) => buyPropertyUpgrade(current, upgradeId));
  };

  const skipUpgrades = () => {
    setSession((current) => finishPropertyTurn(current, {
      title: 'Skipped Upgrades',
      description: 'Cash stayed ready for the next deal.',
      riskDelta: -1,
    }));
  };

  const continueTurn = () => {
    setSession((current) => continuePropertyTurn(current));
  };

  const restart = () => {
    completionLogged.current = false;
    setSession(createInitialPropertySession());
  };

  const tokenScale = tokenPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] });

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inlineHeader}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.75}>
            <Text style={styles.headerAction}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.wordmark}>Coinly</Text>
          <View style={styles.headerRightActions}>
            <Text style={styles.headerAction}>GAME</Text>
            {aiHeaderButton}
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>PROPERTY LADDER</Text>
          <Text style={styles.title}>Month {Math.min(session.month, session.maxMonths)}</Text>
          <Text style={styles.body}>{session.message ?? game.fantasy}</Text>
        </View>

        <View style={styles.hudRow}>
          <HudCard label="Cash" value={formatMoney(session.cash)} alert={session.cash < 5000} />
          <HudCard label="Net Worth" value={formatMoney(netWorth)} />
          <HudCard label="Risk" value={`${session.risk}/100`} alert={session.risk >= 75} />
        </View>

        <View style={styles.progressPanel}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>TARGET {formatMoney(session.targetNetWorth)}</Text>
            <Text style={styles.progressLabel}>{Math.round(progressPct)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
        </View>

        <PropertyBoard
          tiles={propertyBoardTiles}
          activeTile={activeTile}
          position={session.position}
          holdings={session.holdings}
          tokenScale={tokenScale}
        />

        <DicePanel
          session={session}
          activeTile={activeTile}
          onRoll={roll}
        />

        {session.phase === 'deal' && activeDeal ? (
          <DealPanel
            deal={activeDeal}
            cash={session.cash}
            onBuy={() => chooseDeal(activeDeal)}
            onSkip={passDeal}
          />
        ) : null}

        {session.phase === 'choice' && session.activeChoice ? (
          <ChoicePanel choice={session.activeChoice} onChoose={chooseEvent} />
        ) : null}

        {session.phase === 'upgrade' ? (
          <UpgradePanel session={session} onBuy={chooseUpgrade} onSkip={skipUpgrades} />
        ) : null}

        {session.phase === 'ledger' && session.lastLedger ? (
          <LedgerPanel ledger={session.lastLedger} onContinue={continueTurn} />
        ) : null}

        {session.phase === 'result' ? (
          <ResultPanel session={session} onBack={onBack} onRestart={restart} />
        ) : null}

        <PortfolioPanel session={session} />
      </ScrollView>
    </View>
  );
}

function PropertyBoard({
  tiles,
  activeTile,
  position,
  holdings,
  tokenScale,
}: {
  tiles: PropertyTile[];
  activeTile: PropertyTile;
  position: number;
  holdings: PropertyHolding[];
  tokenScale: Animated.AnimatedInterpolation<string | number>;
}) {
  return (
    <View style={styles.boardFrame}>
      <NeighborhoodScene holdings={holdings} activeTile={activeTile} />
      {tiles.map((tile, index) => {
        const active = index === position;
        return (
          <View
            key={tile.id}
            style={[
              styles.boardTile,
              tilePositions[index],
              { borderColor: active ? colors.black : tile.accent },
              active && styles.boardTileActive,
            ]}
          >
            <Text style={styles.tileIndex}>{String(index + 1).padStart(2, '0')}</Text>
            <Text style={styles.tileTitle} numberOfLines={2} adjustsFontSizeToFit>{tile.title}</Text>
            <View style={[styles.tileStripe, { backgroundColor: tile.accent }]} />
            {active ? (
              <Animated.View style={[styles.playerToken, { transform: [{ scale: tokenScale }] }]}>
                <Text style={styles.playerTokenText}>$</Text>
              </Animated.View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function NeighborhoodScene({ holdings, activeTile }: { holdings: PropertyHolding[]; activeTile: PropertyTile }) {
  const visibleHoldings = holdings.slice(0, 5);
  return (
    <View style={styles.neighborhood}>
      <View style={styles.skyline}>
        {(visibleHoldings.length ? visibleHoldings : [undefined, undefined, undefined]).map((holding, index) => (
          <View key={holding?.id ?? `empty-${index}`} style={styles.sceneLot}>
            <View
              style={[
                styles.sceneBuilding,
                {
                  height: 42 + index * 10 + (holding?.units ?? 1) * 4,
                  backgroundColor: holding?.color ?? '#D9D3BE',
                },
              ]}
            >
              <View style={styles.sceneRoof} />
              <View style={styles.windowRow}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>
              <View style={styles.windowRow}>
                <View style={styles.window} />
                <View style={styles.window} />
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.street}>
        <View style={styles.streetLine} />
        <Text style={styles.sceneLabel}>{activeTile.title}</Text>
      </View>
    </View>
  );
}

function DicePanel({
  session,
  activeTile,
  onRoll,
}: {
  session: PropertySession;
  activeTile: PropertyTile;
  onRoll: () => void;
}) {
  const canRoll = session.status === 'playing' && session.phase === 'board';
  return (
    <View style={styles.dicePanel}>
      <View style={styles.diceBox}>
        <Text style={styles.diceLabel}>DICE</Text>
        <Text style={styles.diceValue}>{session.dice}</Text>
      </View>
      <View style={styles.diceCopy}>
        <Text style={styles.panelTitle}>{activeTile.title}</Text>
        <Text style={styles.panelBody}>{activeTile.description}</Text>
      </View>
      <TouchableOpacity
        style={[styles.rollButton, !canRoll && styles.disabledButton]}
        disabled={!canRoll}
        activeOpacity={0.86}
        onPress={onRoll}
      >
        <Text style={styles.rollButtonText}>{canRoll ? 'ROLL' : 'WAIT'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function DealPanel({
  deal,
  cash,
  onBuy,
  onSkip,
}: {
  deal: PropertyDeal;
  cash: number;
  onBuy: () => void;
  onSkip: () => void;
}) {
  const canBuy = cash >= deal.downPayment;
  const cashFlow = deal.rent - deal.mortgage - deal.expenses;
  return (
    <View style={styles.actionPanel}>
      <View style={styles.actionHeader}>
        <Text style={styles.panelEyebrow}>DEAL CARD</Text>
        <Text style={[styles.dealBadge, { backgroundColor: deal.color }]}>{deal.category}</Text>
      </View>
      <Text style={styles.actionTitle}>{deal.title}</Text>
      <Text style={styles.panelBody}>
        Price {formatMoney(deal.price)} / Down {formatMoney(deal.downPayment)} / Units {deal.units}
      </Text>
      <View style={styles.metricGrid}>
        <Metric label="Rent" value={formatMoney(deal.rent)} />
        <Metric label="Debt" value={formatMoney(deal.mortgage)} />
        <Metric label="Expenses" value={formatMoney(deal.expenses)} />
        <Metric label="Cash Flow" value={formatMoney(cashFlow)} alert={cashFlow < 0} />
        <Metric label="Condition" value={`${deal.condition}%`} />
        <Metric label="Risk" value={`+${deal.risk}`} alert={deal.risk >= 20} />
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.82} onPress={onSkip}>
          <Text style={styles.secondaryButtonText}>PASS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, !canBuy && styles.disabledButton]}
          disabled={!canBuy}
          activeOpacity={0.86}
          onPress={onBuy}
        >
          <Text style={styles.primaryButtonText}>{canBuy ? 'BUY DEAL' : 'LOW CASH'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ChoicePanel({
  choice,
  onChoose,
}: {
  choice: PropertyChoice;
  onChoose: (option: PropertyChoiceOption) => void;
}) {
  return (
    <View style={styles.actionPanel}>
      <Text style={styles.panelEyebrow}>EVENT CARD</Text>
      <Text style={styles.actionTitle}>{choice.title}</Text>
      <Text style={styles.panelBody}>{choice.description}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.82} onPress={() => onChoose('secondary')}>
          <Text style={styles.secondaryButtonText}>{choice.secondaryLabel.toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={() => onChoose('primary')}>
          <Text style={styles.primaryButtonText}>{choice.primaryLabel.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function UpgradePanel({
  session,
  onBuy,
  onSkip,
}: {
  session: PropertySession;
  onBuy: (upgradeId: PropertyUpgradeId) => void;
  onSkip: () => void;
}) {
  return (
    <View style={styles.actionPanel}>
      <Text style={styles.panelEyebrow}>UPGRADE DEPOT</Text>
      <Text style={styles.actionTitle}>Improve the portfolio</Text>
      <View style={styles.upgradeGrid}>
        {propertyUpgradeCatalog.map((upgrade) => {
          const level = getPropertyUpgradeLevel(session, upgrade.id);
          const cost = getPropertyUpgradeCost(session, upgrade.id);
          const maxed = level >= upgrade.maxLevel;
          const canBuy = !maxed && session.cash >= cost;
          return (
            <TouchableOpacity
              key={upgrade.id}
              style={[styles.upgradeCard, canBuy && styles.upgradeReady, maxed && styles.upgradeMaxed]}
              disabled={!canBuy}
              activeOpacity={0.82}
              onPress={() => onBuy(upgrade.id)}
            >
              <Text style={styles.upgradeTitle}>{upgrade.title}</Text>
              <Text style={styles.upgradeBody}>{upgrade.description}</Text>
              <Text style={styles.upgradeMeta}>LV {level}/{upgrade.maxLevel} / {maxed ? 'MAX' : formatMoney(cost)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.secondaryFullButton} activeOpacity={0.82} onPress={onSkip}>
        <Text style={styles.secondaryButtonText}>SKIP DEPOT</Text>
      </TouchableOpacity>
    </View>
  );
}

function LedgerPanel({ ledger, onContinue }: { ledger: PropertyTurnLedger; onContinue: () => void }) {
  return (
    <View style={styles.actionPanel}>
      <Text style={styles.panelEyebrow}>MONTH LEDGER</Text>
      <Text style={styles.actionTitle}>{ledger.title}</Text>
      <Text style={styles.panelBody}>{ledger.description}</Text>
      <View style={styles.metricGrid}>
        <Metric label="Rent" value={formatMoney(ledger.rentCollected)} />
        <Metric label="Costs" value={formatMoney(ledger.costs)} alert={ledger.costs > ledger.rentCollected} />
        <Metric label="Cash Flow" value={formatMoney(ledger.cashDelta)} alert={ledger.cashDelta < 0} />
        <Metric label="Equity" value={formatMoney(ledger.equityDelta)} />
        <Metric label="Risk" value={`${ledger.riskDelta >= 0 ? '+' : ''}${ledger.riskDelta}`} alert={ledger.riskDelta > 6} />
        <Metric label="Net Worth" value={formatMoney(ledger.netWorthAfter)} />
      </View>
      <TouchableOpacity style={styles.primaryButtonWide} activeOpacity={0.86} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>NEXT MONTH</Text>
      </TouchableOpacity>
    </View>
  );
}

function ResultPanel({
  session,
  onBack,
  onRestart,
}: {
  session: PropertySession;
  onBack: () => void;
  onRestart: () => void;
}) {
  const netWorth = getPortfolioNetWorth(session);
  const won = session.status === 'won';
  return (
    <View style={[styles.actionPanel, won ? styles.winPanel : styles.lossPanel]}>
      <Text style={styles.panelEyebrow}>{won ? 'PORTFOLIO BUILT' : 'RUN CLOSED'}</Text>
      <Text style={styles.actionTitle}>{won ? 'Target reached' : 'Target missed'}</Text>
      <Text style={styles.panelBody}>{session.message}</Text>
      <View style={styles.metricGrid}>
        <Metric label="Net Worth" value={formatMoney(netWorth)} />
        <Metric label="Gain" value={formatMoney(netWorth - session.startingNetWorth)} />
        <Metric label="Rent" value={formatMoney(session.totalRentCollected)} />
        <Metric label="Costs" value={formatMoney(session.totalCosts)} />
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.82} onPress={onRestart}>
          <Text style={styles.secondaryButtonText}>NEW RUN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onBack}>
          <Text style={styles.primaryButtonText}>ARCADE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PortfolioPanel({ session }: { session: PropertySession }) {
  return (
    <View style={styles.portfolioPanel}>
      <View style={styles.portfolioHeader}>
        <Text style={styles.sectionTitle}>Portfolio</Text>
        <Text style={styles.portfolioMeta}>
          Equity {formatMoney(getPortfolioEquity(session))} / Flow {formatMoney(getMonthlyCashFlow(session))}
        </Text>
      </View>
      {session.holdings.length === 0 ? (
        <View style={styles.emptyPortfolio}>
          <Text style={styles.emptyTitle}>No properties yet</Text>
          <Text style={styles.emptyBody}>Buy a deal card to start collecting rent and building equity.</Text>
        </View>
      ) : (
        <View style={styles.holdingGrid}>
          {session.holdings.map((holding, index) => (
            <HoldingCard key={`${holding.id}-${holding.purchaseMonth}-${index}`} holding={holding} />
          ))}
        </View>
      )}
    </View>
  );
}

function HoldingCard({ holding }: { holding: PropertyHolding }) {
  const equity = holding.currentValue - holding.loanBalance;
  const cashFlow = holding.rent - holding.mortgage - holding.expenses;
  return (
    <View style={styles.holdingCard}>
      <View style={styles.holdingTop}>
        <MiniBuilding color={holding.color} units={holding.units} />
        <View style={styles.holdingCopy}>
          <Text style={styles.holdingTitle}>{holding.title}</Text>
          <Text style={styles.holdingMeta}>{holding.units} unit{holding.units === 1 ? '' : 's'} / condition {holding.condition}%</Text>
        </View>
      </View>
      <View style={styles.holdingStats}>
        <Text style={styles.holdingStat}>Value {formatMoney(holding.currentValue)}</Text>
        <Text style={styles.holdingStat}>Equity {formatMoney(equity)}</Text>
        <Text style={styles.holdingStat}>Flow {formatMoney(cashFlow)}</Text>
        <Text style={styles.holdingStat}>{holding.vacancyMonths > 0 ? 'Vacant' : 'Occupied'}</Text>
      </View>
    </View>
  );
}

function MiniBuilding({ color, units }: { color: string; units: number }) {
  return (
    <View style={[styles.miniBuilding, { backgroundColor: color }]}>
      <View style={styles.miniRoof} />
      {Array.from({ length: Math.min(4, units + 1) }).map((_, index) => (
        <View key={index} style={styles.miniWindow} />
      ))}
    </View>
  );
}

function HudCard({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <View style={[styles.hudCard, alert && styles.hudAlert]}>
      <Text style={styles.hudLabel}>{label}</Text>
      <Text style={styles.hudValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

function Metric({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <View style={[styles.metricBox, alert && styles.metricAlert]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

function formatMoney(value: number) {
  const rounded = Math.round(value);
  const prefix = rounded < 0 ? '-$' : '$';
  return `${prefix}${Math.abs(rounded).toLocaleString('en-US')}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.green },
  content: { paddingHorizontal: 18 },
  inlineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerAction: { width: 62, color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  headerRightActions: { minWidth: 174, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  wordmark: { color: colors.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, includeFontPadding: false },
  hero: { marginTop: 24 },
  eyebrow: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  title: { marginTop: 7, color: colors.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 44, lineHeight: 48, includeFontPadding: false },
  body: { marginTop: 12, color: colors.black, fontSize: 15, lineHeight: 22, fontWeight: '800' },
  hudRow: { marginTop: 18, flexDirection: 'row', gap: 8 },
  hudCard: { flex: 1, minHeight: 62, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.white, padding: 9, justifyContent: 'space-between' },
  hudAlert: { backgroundColor: '#F6C4AE' },
  hudLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 15 },
  hudValue: { color: colors.black, fontWeight: '900', fontSize: 20 },
  progressPanel: { marginTop: 10, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: '#E8E0C8', padding: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
  progressTrack: { marginTop: 8, height: 14, borderWidth: 2, borderColor: colors.black, borderRadius: 7, backgroundColor: colors.white, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#77B7B2' },
  boardFrame: { marginTop: 16, height: 390, borderWidth: 3, borderColor: colors.black, borderRadius: 8, backgroundColor: '#8DAA5B', position: 'relative', overflow: 'hidden' },
  boardTile: { position: 'absolute', width: '18%', height: '18%', borderWidth: 2, borderRadius: 8, backgroundColor: colors.white, padding: 5, overflow: 'hidden' },
  boardTileActive: { borderWidth: 3, backgroundColor: colors.yellow },
  tileIndex: { color: colors.muted, fontFamily: 'BebasNeue_400Regular', fontSize: 12 },
  tileTitle: { color: colors.black, fontSize: 10, lineHeight: 12, fontWeight: '900' },
  tileStripe: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 7 },
  playerToken: { position: 'absolute', right: 3, bottom: 8, width: 24, height: 24, borderWidth: 2, borderColor: colors.black, borderRadius: 12, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  playerTokenText: { color: colors.yellow, fontWeight: '900', fontSize: 14 },
  neighborhood: { position: 'absolute', left: '22%', top: '22%', width: '56%', height: '56%', borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: '#9DD7F2', overflow: 'hidden' },
  skyline: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 7, paddingHorizontal: 9, paddingBottom: 24 },
  sceneLot: { width: 31, alignItems: 'center', justifyContent: 'flex-end' },
  sceneBuilding: { width: 30, borderWidth: 2, borderColor: colors.black, borderRadius: 4, alignItems: 'center', justifyContent: 'center', paddingTop: 7 },
  sceneRoof: { position: 'absolute', top: -8, width: 24, height: 12, borderWidth: 2, borderColor: colors.black, backgroundColor: '#A6635F', transform: [{ rotate: '45deg' }] },
  windowRow: { flexDirection: 'row', gap: 4, marginTop: 5 },
  window: { width: 7, height: 8, borderWidth: 1, borderColor: colors.black, backgroundColor: colors.yellow },
  street: { height: 34, borderTopWidth: 2, borderTopColor: colors.black, backgroundColor: '#4C5550', alignItems: 'center', justifyContent: 'center' },
  streetLine: { position: 'absolute', top: 6, left: 10, right: 10, height: 2, backgroundColor: colors.yellow },
  sceneLabel: { color: colors.white, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
  dicePanel: { marginTop: 14, minHeight: 96, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.white, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  diceBox: { width: 64, height: 64, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  diceLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 14 },
  diceValue: { color: colors.black, fontWeight: '900', fontSize: 28 },
  diceCopy: { flex: 1 },
  panelTitle: { color: colors.black, fontWeight: '900', fontSize: 16 },
  panelBody: { marginTop: 6, color: colors.black, fontSize: 13, lineHeight: 19, fontWeight: '700' },
  rollButton: { width: 70, height: 52, borderWidth: 2, borderColor: colors.black, borderRadius: 26, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  rollButtonText: { color: colors.yellow, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  disabledButton: { opacity: 0.45 },
  actionPanel: { marginTop: 14, borderWidth: 3, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.white, padding: 14 },
  winPanel: { backgroundColor: '#DCE8C5' },
  lossPanel: { backgroundColor: '#F4D7CF' },
  actionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  panelEyebrow: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  dealBadge: { borderWidth: 2, borderColor: colors.black, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, color: colors.black, fontWeight: '900', fontSize: 11, overflow: 'hidden' },
  actionTitle: { marginTop: 8, color: colors.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 29, lineHeight: 33 },
  metricGrid: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricBox: { width: '31%', minHeight: 62, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: '#F8F3E2', padding: 8, justifyContent: 'space-between' },
  metricAlert: { backgroundColor: '#F6C4AE' },
  metricLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 14 },
  metricValue: { color: colors.black, fontSize: 16, fontWeight: '900' },
  actionRow: { marginTop: 14, flexDirection: 'row', gap: 10 },
  primaryButton: { flex: 1, minHeight: 50, borderWidth: 2, borderColor: colors.black, borderRadius: 25, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  primaryButtonWide: { marginTop: 14, minHeight: 52, borderWidth: 2, borderColor: colors.black, borderRadius: 26, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 21 },
  secondaryButton: { flex: 1, minHeight: 50, borderWidth: 2, borderColor: colors.black, borderRadius: 25, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  secondaryFullButton: { marginTop: 12, minHeight: 48, borderWidth: 2, borderColor: colors.black, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 20 },
  upgradeGrid: { marginTop: 12, gap: 10 },
  upgradeCard: { borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: '#F8F3E2', padding: 12 },
  upgradeReady: { backgroundColor: colors.yellow },
  upgradeMaxed: { backgroundColor: '#DCE8C5' },
  upgradeTitle: { color: colors.black, fontWeight: '900', fontSize: 15 },
  upgradeBody: { marginTop: 5, color: colors.black, fontSize: 12, lineHeight: 17, fontWeight: '700' },
  upgradeMeta: { marginTop: 7, color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 17 },
  portfolioPanel: { marginTop: 16, marginBottom: 6 },
  portfolioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 },
  sectionTitle: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 24 },
  portfolioMeta: { flex: 1, color: colors.black, textAlign: 'right', fontSize: 12, lineHeight: 16, fontWeight: '900' },
  emptyPortfolio: { marginTop: 10, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.28)', padding: 14 },
  emptyTitle: { color: colors.black, fontWeight: '900', fontSize: 15 },
  emptyBody: { marginTop: 5, color: colors.black, fontSize: 13, lineHeight: 18, fontWeight: '700' },
  holdingGrid: { marginTop: 10, gap: 10 },
  holdingCard: { borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.white, padding: 12 },
  holdingTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  holdingCopy: { flex: 1 },
  holdingTitle: { color: colors.black, fontSize: 15, fontWeight: '900' },
  holdingMeta: { marginTop: 3, color: colors.black, fontSize: 12, fontWeight: '700' },
  holdingStats: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  holdingStat: { minWidth: '46%', color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
  miniBuilding: { width: 46, height: 58, borderWidth: 2, borderColor: colors.black, borderRadius: 6, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 4, paddingTop: 9 },
  miniRoof: { position: 'absolute', top: -8, width: 28, height: 14, borderWidth: 2, borderColor: colors.black, backgroundColor: '#A6635F', transform: [{ rotate: '45deg' }] },
  miniWindow: { width: 10, height: 10, borderWidth: 1, borderColor: colors.black, backgroundColor: colors.white },
});
