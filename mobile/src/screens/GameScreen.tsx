import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createInitialGameState, runQuickPlay, selectUpgrade, updateDecision } from '../engine/gameEngine';
import {
  LEMONADE_ROUND_SECONDS,
  buyIngredient,
  buyLemonadeUpgrade,
  calculateBatchCost,
  canMixBatch,
  createInitialLemonadeSession,
  createLemonadeCustomer,
  evaluateCustomerReply,
  finishLemonadeRound,
  getBatchCapacity,
  getExpansion,
  getIngredientUse,
  getLemonadeEvent,
  getLocation,
  getServiceCooldownMs,
  getSpawnIntervalMs,
  getUpgradeCost,
  getUpgradeLevel,
  hireWorker,
  ingredientMarket,
  lemonadeLocations,
  lemonadeUpgradeCatalog,
  mixLemonadeBatch,
  normalizeLemonadeSession,
  performStationTask,
  runWorkerActions,
  serveLemonadeCustomer,
  setShopExpansion,
  setLemonadeLocation,
  shopExpansions,
  tickShopSystems,
  upgradeWorker,
  updateLemonadeRecipe,
} from '../engine/lemonadeEngine';
import LemonadeShop3D from './LemonadeShop3D';
import PropertyLadderScreen from './PropertyLadderScreen';
import { appColors as colors } from '../theme';
import type {
  CustomerDialogue,
  CustomerReview,
  GameDefinition,
  GameResult,
  GameState,
  LemonadeCustomer,
  LemonadeFloatingText,
  LemonadeIngredientId,
  LemonadeLocationId,
  LemonadePhase,
  LemonadeRoundStats,
  LemonadeSession,
  LemonadeUpgradeId,
  PropertySession,
  ShopExpansionId,
  StationId,
  WorkerRole,
} from '../types/game';

type Props = {
  aiHeaderButton?: React.ReactNode;
  game: GameDefinition;
  lemonadeSession?: LemonadeSession;
  propertySession?: PropertySession;
  onBack: () => void;
  onComplete: (result: GameResult) => void;
  onUpdateLemonadeSession?: (session: LemonadeSession) => void;
  onUpdatePropertySession?: (session: PropertySession) => void;
};

type RoundMetrics = {
  served: number;
  missed: number;
  revenue: number;
  satisfactionTotal: number;
  satisfactionCount: number;
  reviews: CustomerReview[];
};

const emptyMetrics: RoundMetrics = {
  served: 0,
  missed: 0,
  revenue: 0,
  satisfactionTotal: 0,
  satisfactionCount: 0,
  reviews: [],
};

export default function GameScreen(props: Props) {
  if (props.game.id === 'lemonade-empire') return <LemonadeEmpireScreen {...props} />;
  if (props.game.id === 'property-ladder') return <PropertyLadderScreen {...props} />;
  return <FallbackGameScreen {...props} />;
}

function LemonadeEmpireScreen({
  aiHeaderButton,
  game,
  lemonadeSession,
  onBack,
  onComplete,
  onUpdateLemonadeSession,
}: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    BebasNeue_400Regular,
  });
  const [phase, setPhase] = useState<LemonadePhase>('forecast');
  const [session, setSession] = useState<LemonadeSession>(() => normalizeLemonadeSession(lemonadeSession ?? createInitialLemonadeSession()));
  const [customers, setCustomers] = useState<LemonadeCustomer[]>([]);
  const [activeCustomer, setActiveCustomer] = useState<LemonadeCustomer | null>(null);
  const [reply, setReply] = useState('');
  const [lastDialogue, setLastDialogue] = useState<CustomerDialogue | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<LemonadeFloatingText[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(LEMONADE_ROUND_SECONDS);
  const [metrics, setMetrics] = useState<RoundMetrics>(emptyMetrics);
  const [lastServeAt, setLastServeAt] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const customerIndex = useRef(0);
  const sessionRef = useRef(session);
  const metricsRef = useRef(metrics);
  const secondsLeftRef = useRef(secondsLeft);
  const pulse = useRef(new Animated.Value(0)).current;

  const event = useMemo(() => getLemonadeEvent(session.round), [session.round]);
  const location = getLocation(session);
  const batchCost = calculateBatchCost(session.recipe, event, session);
  const needed = getIngredientUse(session.recipe);
  const canMix = canMixBatch(session);
  const capacity = getBatchCapacity(session);

  useEffect(() => {
    onUpdateLemonadeSession?.(session);
    sessionRef.current = session;
  }, [onUpdateLemonadeSession, session]);

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 780,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 780,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);

  useEffect(() => {
    if (phase !== 'stand') {
      clearLoopTimers(timerRef, spawnRef);
      return undefined;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          endRound();
          return 0;
        }
        return current - 1;
      });

      setCustomers((current) => {
        let missed = 0;
        const nextCustomers: LemonadeCustomer[] = [];
        current.forEach((customer) => {
          const nextPatience = customer.patience - 1;
          if (nextPatience <= 0) {
            missed += 1;
          } else {
            nextCustomers.push({
              ...customer,
              patience: nextPatience,
              mood: nextPatience < customer.maxPatience * 0.28 ? 'angry' : 'waiting',
            });
          }
        });
        if (missed) {
          setMetrics((currentMetrics) => ({ ...currentMetrics, missed: currentMetrics.missed + missed }));
          setSession((currentSession) => ({ ...currentSession, combo: 0 }));
          addFloatingText(`-${missed} review risk`, 36, 30);
        }
        return nextCustomers;
      });

      setSession((current) => runWorkerActions(tickShopSystems(current)));
    }, 1000);

    spawnRef.current = setInterval(() => {
      setCustomers((current) => {
        if (current.length >= getExpansion(sessionRef.current).customerCapacity || sessionRef.current.inventory <= 0) return current;
        const nextCustomer = createLemonadeCustomer(sessionRef.current, secondsLeftRef.current, customerIndex.current);
        customerIndex.current += 1;
        return [...current, nextCustomer];
      });
    }, Math.min(1400, getSpawnIntervalMs(sessionRef.current)));

    return () => clearLoopTimers(timerRef, spawnRef);
  }, [phase]);

  if (!fontsLoaded) return null;

  const setPhaseScreen = (nextPhase: LemonadePhase) => {
    setPhase(nextPhase);
  };

  const buyMarketPack = (ingredientId: LemonadeIngredientId) => {
    setSession((current) => buyIngredient(current, ingredientId));
  };

  const updateRecipe = (key: 'price' | 'sweetness' | 'ice' | 'batchSize', delta: number) => {
    setSession((current) => updateLemonadeRecipe(current, key, delta));
  };

  const mixBatch = () => {
    if (!canMix) return;
    const nextSession = mixLemonadeBatch(session);
    setSession(nextSession);
    sessionRef.current = nextSession;
    setPhase('stand');
    setCustomers(createOpeningCustomers(nextSession, 3));
    setFloatingTexts([]);
    setMetrics(emptyMetrics);
    setSecondsLeft(LEMONADE_ROUND_SECONDS);
    customerIndex.current = 3;
    setActiveCustomer(null);
    setReply('');
    setLastDialogue(null);
  };

  const openTalk = (customer: LemonadeCustomer) => {
    setActiveCustomer(customer);
    setReply('');
    setLastDialogue(null);
  };

  const submitReply = () => {
    if (!activeCustomer || !reply.trim()) return;
    const dialogue = evaluateCustomerReply(session, activeCustomer, reply.trim());
    setLastDialogue(dialogue);
    setActiveCustomer({ ...activeCustomer, dialogue });
  };

  const serveCustomer = (customer: LemonadeCustomer, dialogue?: CustomerDialogue) => {
    const now = Date.now();
    if (now - lastServeAt < getServiceCooldownMs(session)) return;
    setLastServeAt(now);
    const served = serveLemonadeCustomer(session, customer, dialogue);
    setSession(served.session);
    setCustomers((current) => current.filter((item) => item.id !== customer.id));
    setMetrics((current) => ({
      served: current.served + (served.earned > 0 ? 1 : 0),
      missed: current.missed,
      revenue: current.revenue + served.earned,
      satisfactionTotal: current.satisfactionTotal + served.satisfaction,
      satisfactionCount: current.satisfactionCount + 1,
      reviews: [served.review, ...current.reviews].slice(0, 12),
    }));
    addFloatingText(served.earned > 0 ? `+$${served.earned.toFixed(2)}` : 'SOLD OUT', customer.x, 34);
    setActiveCustomer(null);
    setReply('');
    setLastDialogue(null);
  };

  const endRound = () => {
    clearLoopTimers(timerRef, spawnRef);
    setCustomers([]);
    setActiveCustomer(null);
    setPhase('reviews');
    setSession((current) => {
      const finalSession = finishLemonadeRound(current, metricsRef.current);
      const result = finalSession.lastResult;
      if (result) onComplete(toGameResult(result, game.id, game.competency));
      return finalSession;
    });
  };

  const buyUpgrade = (upgradeId: LemonadeUpgradeId) => {
    setSession((current) => buyLemonadeUpgrade(current, upgradeId));
  };

  const chooseLocation = (locationId: LemonadeLocationId) => {
    setSession((current) => setLemonadeLocation(current, locationId));
  };

  const tapStation = (stationId: StationId) => {
    setSession((current) => {
      const nextSession = performStationTask(current, stationId);
      sessionRef.current = nextSession;
      if (stationId === 'pitcher' && customers.length === 0 && nextSession.inventory > 0) {
        setCustomers(createOpeningCustomers(nextSession, 2));
        customerIndex.current = Math.max(customerIndex.current, 2);
      }
      return nextSession;
    });
    addFloatingText(stationId.toUpperCase(), 42, 18);
  };

  const addWorker = (role: WorkerRole) => {
    setSession((current) => hireWorker(current, role));
  };

  const trainWorker = (workerId: string) => {
    setSession((current) => upgradeWorker(current, workerId));
  };

  const chooseExpansion = (expansionId: ShopExpansionId) => {
    setSession((current) => setShopExpansion(current, expansionId));
  };

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.75}>
          <Text style={styles.headerAction}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.wordmark}>Coinly</Text>
        <View style={styles.headerRightActions}>
          <Text style={styles.headerAction}>GAME</Text>
          {aiHeaderButton}
        </View>
      </View>

      {phase === 'stand' ? (
        <StandScreen
          session={session}
          eventTitle={event.title}
          eventBody={event.description}
          customers={customers}
          floatingTexts={floatingTexts}
          secondsLeft={secondsLeft}
          pulseScale={pulseScale}
          activeCustomer={activeCustomer}
          reply={reply}
          lastDialogue={lastDialogue}
          bottomInset={insets.bottom}
          onTalk={openTalk}
          onStationPress={tapStation}
          onHireWorker={addWorker}
          onUpgradeWorker={trainWorker}
          onReplyChange={setReply}
          onSubmitReply={submitReply}
          onServe={serveCustomer}
          onCloseTalk={() => setActiveCustomer(null)}
          onEndRound={endRound}
        />
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
          {phase === 'forecast' ? (
            <ForecastScreen
              session={session}
              eventTitle={event.title}
              eventDescription={event.description}
              competitor={event.competitor}
              locationDemand={location.demand}
              onLocation={chooseLocation}
              onContinue={() => setPhaseScreen('market')}
            />
          ) : null}

          {phase === 'market' ? (
            <MarketScreen session={session} onBuy={buyMarketPack} onContinue={() => setPhaseScreen('mix')} />
          ) : null}

          {phase === 'mix' ? (
            <MixScreen
              session={session}
              needed={needed}
              batchCost={batchCost}
              capacity={capacity}
              canMix={canMix}
              onRecipeChange={updateRecipe}
              onMix={mixBatch}
            />
          ) : null}

          {phase === 'reviews' && session.lastResult ? (
            <ReviewsScreen result={session.lastResult} onContinue={() => setPhaseScreen('ledger')} />
          ) : null}

          {phase === 'ledger' && session.lastResult?.ledger ? (
            <LedgerScreen session={session} result={session.lastResult} onContinue={() => setPhaseScreen('shop')} />
          ) : null}

          {phase === 'shop' ? (
            <ShopScreen
              session={session}
              onBuy={buyUpgrade}
              onExpansion={chooseExpansion}
              onNextRound={() => setPhaseScreen('forecast')}
            />
          ) : null}
        </ScrollView>
      )}
    </View>
  );

  function addFloatingText(label: string, x: number, y: number) {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts((current) => [...current.slice(-5), { id, label, x, y }]);
    setTimeout(() => {
      setFloatingTexts((current) => current.filter((item) => item.id !== id));
    }, 900);
  }
}

function ForecastScreen({
  session,
  eventTitle,
  eventDescription,
  competitor,
  locationDemand,
  onLocation,
  onContinue,
}: {
  session: LemonadeSession;
  eventTitle: string;
  eventDescription: string;
  competitor?: string;
  locationDemand: number;
  onLocation: (locationId: LemonadeLocationId) => void;
  onContinue: () => void;
}) {
  return (
    <View>
      <Hero eyebrow="LEMONADE EMPIRE" title={`Day ${session.day}, Round ${session.round}`} body="Run the full stand: source ingredients, mix the batch, serve customers, handle reviews, and scale the business." />
      <View style={styles.scoreStrip}>
        <HudChip label="Cash" value={`$${session.cash.toFixed(0)}`} />
        <HudChip label="Rep" value={`${session.reputation}`} />
        <HudChip label="XP" value={`${session.xp}`} />
      </View>
      <View style={styles.darkPanel}>
        <Text style={styles.darkEyebrow}>FORECAST</Text>
        <Text style={styles.darkTitle}>{eventTitle}</Text>
        <Text style={styles.darkBody}>{eventDescription}</Text>
        <Text style={styles.darkBody}>{competitor}</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Location</Text>
        {lemonadeLocations.map((location) => {
          const locked = session.reputation < location.unlockReputation;
          const selected = session.locationId === location.id;
          return (
            <TouchableOpacity
              key={location.id}
              style={[styles.locationRow, selected && styles.selectedRow, locked && styles.lockedRow]}
              disabled={locked}
              activeOpacity={0.82}
              onPress={() => onLocation(location.id)}
            >
              <View>
                <Text style={styles.rowTitle}>{location.title}</Text>
                <Text style={styles.rowBody}>Demand x{location.demand.toFixed(2)} / Rent ${location.rent}</Text>
              </View>
              <Text style={styles.rowToken}>{locked ? `${location.unlockReputation} REP` : selected ? 'SET' : 'MOVE'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.costPanel}>
        <Text style={styles.costLabel}>Expected traffic</Text>
        <Text style={styles.costValue}>{Math.round(36 * locationDemand)} customers</Text>
      </View>
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>GO TO MARKET</Text>
      </TouchableOpacity>
    </View>
  );
}

function MarketScreen({
  session,
  onBuy,
  onContinue,
}: {
  session: LemonadeSession;
  onBuy: (ingredientId: LemonadeIngredientId) => void;
  onContinue: () => void;
}) {
  return (
    <View>
      <Hero eyebrow="MARKET" title="Buy real inputs" body="Ingredients persist. Overstocking ties up cash, but underbuying caps sales." />
      <InventoryStrip ingredients={session.ingredients} />
      <View style={styles.shopGrid}>
        {ingredientMarket.map((offer) => {
          const canBuy = session.cash >= offer.packCost;
          return (
            <TouchableOpacity
              key={offer.id}
              style={[styles.shopCard, canBuy && styles.shopCardReady]}
              activeOpacity={0.82}
              disabled={!canBuy}
              onPress={() => onBuy(offer.id)}
            >
              <Text style={styles.shopTitle}>{offer.title}</Text>
              <Text style={styles.shopBody}>{offer.description}</Text>
              <Text style={styles.shopMeta}>+{offer.packSize} {offer.unit} / ${offer.packCost}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>MIX LEMONADE</Text>
      </TouchableOpacity>
    </View>
  );
}

function MixScreen({
  session,
  needed,
  batchCost,
  capacity,
  canMix,
  onRecipeChange,
  onMix,
}: {
  session: LemonadeSession;
  needed: LemonadeSession['ingredients'];
  batchCost: number;
  capacity: number;
  canMix: boolean;
  onRecipeChange: (key: 'price' | 'sweetness' | 'ice' | 'batchSize', delta: number) => void;
  onMix: () => void;
}) {
  const preview = session.batch;
  return (
    <View>
      <Hero eyebrow="MIXING STATION" title="Make the lemonade" body="Tune taste, coldness, cost per cup, and selling price before opening." />
      <View style={styles.mixerScene}>
        <View style={styles.pitcher}>
          <View style={[styles.pitcherFill, { height: `${Math.min(86, session.recipe.batchSize / capacity * 100)}%` }]} />
        </View>
        <View style={styles.ingredientBins}>
          <IngredientDot label="Lemons" value={needed.lemons} />
          <IngredientDot label="Sugar" value={needed.sugar} />
          <IngredientDot label="Ice" value={needed.ice} />
          <IngredientDot label="Cups" value={needed.cups} />
        </View>
      </View>
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Recipe</Text>
        <Stepper label="Price" value={`$${session.recipe.price}`} onMinus={() => onRecipeChange('price', -0.5)} onPlus={() => onRecipeChange('price', 0.5)} />
        <Stepper label="Sweetness" value={`${session.recipe.sweetness}/5`} onMinus={() => onRecipeChange('sweetness', -1)} onPlus={() => onRecipeChange('sweetness', 1)} />
        <Stepper label="Ice" value={`${session.recipe.ice}/5`} onMinus={() => onRecipeChange('ice', -1)} onPlus={() => onRecipeChange('ice', 1)} />
        <Stepper label="Batch" value={`${session.recipe.batchSize}/${capacity}`} onMinus={() => onRecipeChange('batchSize', -10)} onPlus={() => onRecipeChange('batchSize', 10)} />
      </View>
      <View style={styles.resultGrid}>
        <ResultBox label="Batch cost" value={`$${batchCost.toFixed(2)}`} />
        <ResultBox label="Need lemons" value={`${needed.lemons}/${session.ingredients.lemons}`} />
        <ResultBox label="Need sugar" value={`${needed.sugar}/${session.ingredients.sugar}`} />
        <ResultBox label="Need ice" value={`${needed.ice}/${session.ingredients.ice}`} />
      </View>
      {preview ? <Text style={styles.body}>Last batch quality: {preview.quality}/100.</Text> : null}
      {!canMix ? <Text style={styles.warningText}>Not enough ingredients for this batch. Buy more or lower batch size.</Text> : null}
      <TouchableOpacity style={[styles.primaryButton, !canMix && styles.disabledButton]} disabled={!canMix} activeOpacity={0.86} onPress={onMix}>
        <Text style={styles.primaryButtonText}>MIX & OPEN STAND</Text>
      </TouchableOpacity>
    </View>
  );
}

function StandScreen({
  session,
  eventTitle,
  eventBody,
  customers,
  floatingTexts,
  secondsLeft,
  pulseScale,
  activeCustomer,
  reply,
  lastDialogue,
  bottomInset,
  onTalk,
  onStationPress,
  onHireWorker,
  onUpgradeWorker,
  onReplyChange,
  onSubmitReply,
  onServe,
  onCloseTalk,
  onEndRound,
}: {
  session: LemonadeSession;
  eventTitle: string;
  eventBody: string;
  customers: LemonadeCustomer[];
  floatingTexts: LemonadeFloatingText[];
  secondsLeft: number;
  pulseScale: Animated.AnimatedInterpolation<string | number>;
  activeCustomer: LemonadeCustomer | null;
  reply: string;
  lastDialogue: CustomerDialogue | null;
  bottomInset: number;
  onTalk: (customer: LemonadeCustomer) => void;
  onStationPress: (stationId: StationId) => void;
  onHireWorker: (role: WorkerRole) => void;
  onUpgradeWorker: (workerId: string) => void;
  onReplyChange: (text: string) => void;
  onSubmitReply: () => void;
  onServe: (customer: LemonadeCustomer, dialogue?: CustomerDialogue) => void;
  onCloseTalk: () => void;
  onEndRound: () => void;
}) {
  const lowInventory = session.inventory <= Math.max(8, session.recipe.batchSize * 0.15);
  return (
    <View style={styles.standWrap}>
      <ScrollView
        style={styles.playScroll}
        contentContainerStyle={[styles.playContent, { paddingBottom: activeCustomer ? bottomInset + 290 : bottomInset + 18 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hudRow}>
          <HudChip label="Cash" value={`$${session.cash.toFixed(0)}`} />
          <HudChip label="Cups" value={`${session.inventory}`} alert={lowInventory} />
          <HudChip label="Time" value={formatTimer(secondsLeft)} />
        </View>
        <View style={styles.eventBanner}>
          <Text style={styles.eventTitle}>{eventTitle}</Text>
          <Text style={styles.eventBody}>{eventBody}</Text>
        </View>
        <View style={styles.threeScene}>
          <LemonadeShop3D session={session} customerCount={0} onStationPress={onStationPress} />
          {floatingTexts.map((item) => (
            <Text key={item.id} style={[styles.floatText, { left: `${item.x}%`, top: `${item.y}%` }]}>{item.label}</Text>
          ))}
        </View>
        <CustomerQueuePanel
          customers={customers}
          activeCustomerId={activeCustomer?.id ?? null}
          lastDialogue={lastDialogue}
          onTalk={onTalk}
          onServe={onServe}
        />
        <View style={styles.shopStatusPanel}>
          <View style={styles.shopStatusItem}>
            <Text style={styles.shopStatusLabel}>Cleanliness</Text>
            <Text style={styles.shopStatusValue}>{Math.round(session.scene.cleanliness)}%</Text>
          </View>
          <View style={styles.shopStatusItem}>
            <Text style={styles.shopStatusLabel}>Queue</Text>
            <Text style={styles.shopStatusValue}>{customers.length}/{getExpansion(session).customerCapacity}</Text>
          </View>
          <View style={styles.shopStatusItem}>
            <Text style={styles.shopStatusLabel}>Rush</Text>
            <Text style={styles.shopStatusValue}>{Math.round(session.scene.rushMeter)}%</Text>
          </View>
        </View>
        <View style={styles.stationBar}>
          {(Object.keys(session.stations) as StationId[]).map((stationId) => {
            const station = session.stations[stationId];
            return (
              <TouchableOpacity key={stationId} style={[styles.stationButton, station.cooldown > 0 && styles.stationButtonCooling]} activeOpacity={0.82} onPress={() => onStationPress(stationId)}>
                <Text style={styles.stationIcon}>{stationIcon(stationId)}</Text>
                <Text style={styles.stationButtonText}>{station.title.split(' ')[0]}</Text>
                <Text style={styles.stationCooldown}>{station.cooldown > 0 ? `${station.cooldown}s` : 'READY'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.workerPanel}>
          <View style={styles.workerHeader}>
            <Text style={styles.sectionTitle}>Workers</Text>
            <Text style={styles.workerSlots}>{session.workers.length}/{getExpansion(session).workerSlots} slots</Text>
          </View>
          {session.workers.length ? session.workers.map((worker) => (
            <TouchableOpacity key={worker.id} style={styles.workerRow} activeOpacity={0.82} onPress={() => onUpgradeWorker(worker.id)}>
              <View style={styles.workerInfo}>
                <Text style={styles.rowTitle}>{worker.name} / {worker.role}</Text>
                <Text style={styles.workerMeta}>{worker.assignedStation ?? 'unassigned'} / wage ${worker.wage}</Text>
              </View>
              <View style={styles.workerStatBlock}>
                <Text style={styles.rowToken}>LV {worker.level}</Text>
                <View style={styles.staminaTrack}>
                  <View style={[styles.staminaFill, { width: `${Math.max(4, worker.stamina)}%` }]} />
                </View>
              </View>
            </TouchableOpacity>
          )) : (
            <Text style={styles.rowBody}>Hire workers to automate stations while you handle rushes.</Text>
          )}
          <View style={styles.hireRow}>
            {(['cashier', 'mixer', 'server', 'stocker', 'cleaner'] as WorkerRole[]).map((role) => (
              <TouchableOpacity key={role} style={styles.hireButton} activeOpacity={0.82} onPress={() => onHireWorker(role)}>
                <Text style={styles.hireButtonText}>{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.objectiveRow}>
          {session.objectives.map((objective) => (
            <View key={objective.id} style={[styles.objectiveChip, objective.completed && styles.objectiveComplete]}>
              <Text style={styles.objectiveText}>{objective.title}</Text>
              <Text style={styles.objectiveProgress}>{Math.round(objective.progress)}/{objective.target}</Text>
            </View>
          ))}
        </View>
        <View style={styles.playFooter}>
          <View>
            <Text style={styles.comboLabel}>COMBO</Text>
            <Text style={styles.comboValue}>{session.combo}x</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
            <TouchableOpacity style={styles.endButton} activeOpacity={0.86} onPress={onEndRound}>
              <Text style={styles.endButtonText}>END ROUND</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
      {activeCustomer ? (
        <View style={[styles.dialoguePanel, { bottom: bottomInset + 18 }]}>
          <View style={styles.dialogueHeader}>
            <Text style={styles.dialogueTitle}>{activeCustomer.name} / {activeCustomer.personality}</Text>
            <TouchableOpacity onPress={onCloseTalk}><Text style={styles.dialogueClose}>CLOSE</Text></TouchableOpacity>
          </View>
          <Text style={styles.dialoguePrompt}>{(lastDialogue ?? activeCustomer.dialogue)?.prompt}</Text>
          {lastDialogue?.customerResponse ? <Text style={styles.customerResponse}>{lastDialogue.customerResponse}</Text> : null}
          <TextInput
            style={styles.replyInput}
            value={reply}
            onChangeText={onReplyChange}
            placeholder="Type your response to the customer..."
            placeholderTextColor={colors.muted}
            multiline
          />
          <View style={styles.dialogueActions}>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.82} onPress={onSubmitReply}>
              <Text style={styles.secondaryButtonText}>RESPOND</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.yellowMiniButton} activeOpacity={0.82} onPress={() => onServe(activeCustomer, lastDialogue ?? activeCustomer.dialogue)}>
              <Text style={styles.yellowMiniButtonText}>SERVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function CustomerQueuePanel({
  customers,
  activeCustomerId,
  lastDialogue,
  onTalk,
  onServe,
}: {
  customers: LemonadeCustomer[];
  activeCustomerId: string | null;
  lastDialogue: CustomerDialogue | null;
  onTalk: (customer: LemonadeCustomer) => void;
  onServe: (customer: LemonadeCustomer, dialogue?: CustomerDialogue) => void;
}) {
  if (customers.length === 0) {
    return (
      <View style={styles.emptyQueuePanel}>
        <Text style={styles.emptyQueueText}>No customers yet — inventory will attract visitors.</Text>
      </View>
    );
  }
  return (
    <View style={styles.customerQueuePanel}>
      <Text style={styles.customerQueueTitle}>QUEUE — {customers.length} waiting</Text>
      {customers.map((customer) => {
        const isActive = customer.id === activeCustomerId;
        const patiencePct = Math.max(3, (customer.patience / customer.maxPatience) * 100);
        const isAngry = customer.mood === 'angry';
        const bubbleText = isActive && lastDialogue?.customerResponse
          ? lastDialogue.customerResponse
          : customer.dialogue?.prompt ?? null;
        return (
          <View key={customer.id} style={[styles.customerCard, isActive && styles.customerCardActive, isAngry && styles.customerCardAngry]}>
            <View style={styles.customerCardRow}>
              <View style={[styles.customerAvatar, { backgroundColor: customer.color }]}>
                <Text style={styles.customerAvatarLetter}>{customer.name[0]}</Text>
              </View>
              <View style={styles.customerCardMeta}>
                <View style={styles.customerNameRow}>
                  <Text style={styles.customerCardName}>{customer.name}</Text>
                  <View style={styles.personalityTag}>
                    <Text style={styles.personalityTagText}>{customer.personality?.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.customerOrderLabel}>{customer.orderSize} cup{customer.orderSize !== 1 ? 's' : ''}</Text>
                <View style={styles.customerPatienceTrack}>
                  <View style={[styles.customerPatienceFill, isAngry && styles.patienceDanger, { width: `${patiencePct}%` }]} />
                </View>
              </View>
            </View>
            {bubbleText ? (
              <View style={[styles.speechBubble, isAngry && styles.speechBubbleAngry]}>
                <Text style={styles.speechBubbleText}>{bubbleText}</Text>
              </View>
            ) : null}
            <View style={styles.customerCardActions}>
              <TouchableOpacity style={[styles.talkBtn, isActive && styles.talkBtnActive]} activeOpacity={0.8} onPress={() => onTalk(customer)}>
                <Text style={styles.talkBtnText}>TALK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.serveBtn} activeOpacity={0.8} onPress={() => onServe(customer, isActive ? (lastDialogue ?? customer.dialogue) : customer.dialogue)}>
                <Text style={styles.serveBtnText}>SERVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function ReviewsScreen({ result, onContinue }: { result: LemonadeRoundStats; onContinue: () => void }) {
  return (
    <View>
      <Hero eyebrow="REVIEWS" title={`${result.satisfaction}% satisfaction`} body={result.insight} />
      <View style={styles.reviewList}>
        {(result.reviews ?? []).slice(0, 6).map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewTopline}>
              <Text style={styles.reviewName}>{review.customerName}</Text>
              <Text style={styles.reviewStars}>{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</Text>
            </View>
            <Text style={styles.reviewText}>{review.comment}</Text>
            <Text style={styles.reviewMeta}>Tip ${review.tip.toFixed(2)} / Repeat {Math.round(review.repeatChance)}%</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>OPEN LEDGER</Text>
      </TouchableOpacity>
    </View>
  );
}

function LedgerScreen({ session, result, onContinue }: { session: LemonadeSession; result: LemonadeRoundStats; onContinue: () => void }) {
  const ledger = result.ledger;
  if (!ledger) return null;
  return (
    <View>
      <Hero eyebrow="ACCOUNTING" title={`$${ledger.netProfit.toFixed(0)} net`} body="The business view: revenue minus real costs, waste, refunds, and location rent." />
      <View style={styles.resultGrid}>
        <ResultBox label="Revenue" value={`$${ledger.revenue.toFixed(0)}`} />
        <ResultBox label="COGS" value={`$${ledger.cogs.toFixed(0)}`} />
        <ResultBox label="Spoilage" value={`$${ledger.spoilageLoss.toFixed(0)}`} />
        <ResultBox label="Refunds" value={`$${ledger.refunds.toFixed(0)}`} />
        <ResultBox label="Tips" value={`$${ledger.tips.toFixed(0)}`} />
        <ResultBox label="Net" value={`$${ledger.netProfit.toFixed(0)}`} />
      </View>
      <View style={styles.darkPanel}>
        <Text style={styles.darkEyebrow}>BUSINESS STATUS</Text>
        <Text style={styles.darkTitle}>Rep {session.reputation}</Text>
        <Text style={styles.darkBody}>Cash ${session.cash.toFixed(0)} / XP {session.xp} / Regulars {session.regulars}</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Milestones</Text>
        {session.milestones.map((milestone) => (
          <View key={milestone.id} style={styles.milestoneRow}>
            <Text style={styles.rowTitle}>{milestone.title}</Text>
            <Text style={styles.rowToken}>{milestone.achieved ? 'DONE' : 'OPEN'}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>UPGRADE STAND</Text>
      </TouchableOpacity>
    </View>
  );
}

function ShopScreen({
  session,
  onBuy,
  onExpansion,
  onNextRound,
}: {
  session: LemonadeSession;
  onBuy: (upgradeId: LemonadeUpgradeId) => void;
  onExpansion: (expansionId: ShopExpansionId) => void;
  onNextRound: () => void;
}) {
  return (
    <View>
      <Hero eyebrow="UPGRADE SHOP" title="Scale the stand" body="Upgrades change operations: faster service, less spoilage, better demand, and bigger batches." />
      <View style={styles.shopGrid}>
        {lemonadeUpgradeCatalog.map((upgrade) => {
          const level = getUpgradeLevel(session, upgrade.id);
          const cost = getUpgradeCost(session, upgrade.id);
          const maxed = level >= upgrade.maxLevel;
          const canBuy = !maxed && session.cash >= cost;
          return (
            <TouchableOpacity key={upgrade.id} style={[styles.shopCard, canBuy && styles.shopCardReady]} disabled={!canBuy} activeOpacity={0.82} onPress={() => onBuy(upgrade.id)}>
              <Text style={styles.shopTitle}>{upgrade.title}</Text>
              <Text style={styles.shopBody}>{upgrade.description}</Text>
              <Text style={styles.shopMeta}>LV {level}/{upgrade.maxLevel} / {maxed ? 'MAX' : `$${cost}`}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Shop Expansion</Text>
        {shopExpansions.map((expansion) => {
          const locked = session.reputation < expansion.unlockReputation;
          const selected = session.scene.expansionId === expansion.id;
          return (
            <TouchableOpacity
              key={expansion.id}
              style={[styles.locationRow, selected && styles.selectedRow, locked && styles.lockedRow]}
              disabled={locked}
              activeOpacity={0.82}
              onPress={() => onExpansion(expansion.id)}
            >
              <View>
                <Text style={styles.rowTitle}>{expansion.title}</Text>
                <Text style={styles.rowBody}>{expansion.customerCapacity} queue / {expansion.workerSlots} workers</Text>
              </View>
              <Text style={styles.rowToken}>{locked ? `${expansion.unlockReputation} REP` : selected ? 'LIVE' : 'MOVE'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onNextRound}>
        <Text style={styles.primaryButtonText}>NEXT 5-MIN INTERVAL</Text>
      </TouchableOpacity>
    </View>
  );
}

function Hero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

function InventoryStrip({ ingredients }: { ingredients: LemonadeSession['ingredients'] }) {
  return (
    <View style={styles.inventoryGrid}>
      <ResultBox label="Lemons" value={`${ingredients.lemons}`} />
      <ResultBox label="Sugar" value={`${ingredients.sugar}`} />
      <ResultBox label="Ice" value={`${ingredients.ice}`} />
      <ResultBox label="Cups" value={`${ingredients.cups}`} />
    </View>
  );
}

function IngredientDot({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.ingredientDot}>
      <Text style={styles.ingredientDotValue}>{value}</Text>
      <Text style={styles.ingredientDotLabel}>{label}</Text>
    </View>
  );
}

function Stepper({ label, value, onMinus, onPlus }: { label: string; value: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={styles.stepper}>
      <View>
        <Text style={styles.stepperLabel}>{label}</Text>
        <Text style={styles.stepperValue}>{value}</Text>
      </View>
      <View style={styles.stepperControls}>
        <TouchableOpacity style={styles.stepperButton} activeOpacity={0.8} onPress={onMinus}><Text style={styles.stepperButtonText}>-</Text></TouchableOpacity>
        <TouchableOpacity style={styles.stepperButton} activeOpacity={0.8} onPress={onPlus}><Text style={styles.stepperButtonText}>+</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function HudChip({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <View style={[styles.hudChip, alert && styles.hudChipAlert]}>
      <Text style={styles.hudLabel}>{label}</Text>
      <Text style={styles.hudValue}>{value}</Text>
    </View>
  );
}

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultBoxLabel}>{label}</Text>
      <Text style={styles.resultBoxValue}>{value}</Text>
    </View>
  );
}

function FallbackGameScreen({ aiHeaderButton, game, onBack, onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold, BebasNeue_400Regular });
  const [state, setState] = useState<GameState>(() => createInitialGameState(game.id));
  const [result, setResult] = useState<GameResult | null>(null);
  if (!fontsLoaded) return null;
  const runRound = () => {
    const nextResult = runQuickPlay(state);
    setResult(nextResult);
    onComplete(nextResult);
  };
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.inlineHeader}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.75}><Text style={styles.headerAction}>BACK</Text></TouchableOpacity>
          <Text style={styles.wordmark}>Coinly</Text>
          <View style={styles.headerRightActions}>
            <Text style={styles.headerAction}>GAME</Text>
            {aiHeaderButton}
          </View>
        </View>
        <Hero eyebrow="QUICK PLAY" title={game.title} body={game.fantasy} />
        {!result ? (
          <>
            <View style={styles.darkPanel}>
              <Text style={styles.darkEyebrow}>ROUND GOAL</Text>
              <Text style={styles.darkTitle}>{game.quickPlayLabel}</Text>
              <Text style={styles.darkBody}>{game.coachReason}</Text>
            </View>
            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Decisions</Text>
              {game.decisions.map((decision) => (
                <Stepper
                  key={decision.id}
                  label={decision.label}
                  value={`${decision.unit === '$' ? '$' : ''}${state.decisions[decision.id]}${decision.unit !== '$' ? ` ${decision.unit}` : ''}`}
                  onMinus={() => setState((current) => updateDecision(current, decision.id, Math.max(decision.min, (current.decisions[decision.id] ?? decision.defaultValue) - decision.step)))}
                  onPlus={() => setState((current) => updateDecision(current, decision.id, Math.min(decision.max, (current.decisions[decision.id] ?? decision.defaultValue) + decision.step)))}
                />
              ))}
            </View>
            <View style={styles.shopGrid}>
              {game.upgrades.map((upgrade) => (
                <TouchableOpacity key={upgrade.id} style={[styles.shopCard, state.selectedUpgradeId === upgrade.id && styles.shopCardReady]} activeOpacity={0.82} onPress={() => setState((current) => selectUpgrade(current, upgrade.id))}>
                  <Text style={styles.shopTitle}>{upgrade.title}</Text>
                  <Text style={styles.shopBody}>{upgrade.description}</Text>
                  <Text style={styles.shopMeta}>${upgrade.cost} / {upgrade.effect}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={runRound}><Text style={styles.primaryButtonText}>RUN ROUND</Text></TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.resultGrid}>
              <ResultBox label="Revenue" value={`$${result.revenue}`} />
              <ResultBox label="Costs" value={`$${result.costs}`} />
              <ResultBox label="Profit" value={`$${result.profit}`} />
              <ResultBox label="Score" value={`${result.performance}`} />
            </View>
            <Text style={styles.body}>{result.feedback}</Text>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onBack}><Text style={styles.primaryButtonText}>BACK TO ARCADE</Text></TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function toGameResult(result: LemonadeRoundStats, gameId: GameDefinition['id'], competency: string): GameResult {
  return {
    gameId,
    competency,
    performance: Math.max(0, Math.min(100, Math.round(result.satisfaction * 0.62 + Math.max(0, result.profit) * 0.25))),
    timeSpentSeconds: LEMONADE_ROUND_SECONDS,
    timestamp: new Date().toISOString(),
    revenue: result.revenue,
    costs: result.ingredientCost + result.wasteCost + (result.ledger?.refunds ?? 0),
    profit: result.profit,
    feedback: result.insight,
    eventTitle: result.eventTitle,
  };
}

function createOpeningCustomers(session: LemonadeSession, count: number) {
  return Array.from({ length: count }, (_, index) => (
    createLemonadeCustomer(session, LEMONADE_ROUND_SECONDS, index)
  ));
}

function clearLoopTimers(timerRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>, spawnRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>) {
  if (timerRef.current) clearInterval(timerRef.current);
  if (spawnRef.current) clearInterval(spawnRef.current);
  timerRef.current = null;
  spawnRef.current = null;
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

function stationIcon(stationId: StationId) {
  if (stationId === 'register') return '$';
  if (stationId === 'pitcher') return 'MIX';
  if (stationId === 'shelf') return 'BOX';
  if (stationId === 'counter') return 'CUP';
  return 'CLEAN';
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.green },
  topBar: { paddingHorizontal: 18, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inlineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerAction: { width: 62, color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  headerRightActions: { minWidth: 174, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  wordmark: { color: colors.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, includeFontPadding: false },
  content: { paddingHorizontal: 20 },
  standWrap: { flex: 1 },
  playScroll: { flex: 1 },
  playContent: { paddingHorizontal: 16 },
  hero: { marginTop: 28 },
  eyebrow: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  title: { marginTop: 8, color: colors.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 46, lineHeight: 50, includeFontPadding: false },
  body: { marginTop: 14, color: colors.black, fontSize: 16, lineHeight: 23, fontWeight: '700' },
  scoreStrip: { marginTop: 20, flexDirection: 'row', gap: 10 },
  hudRow: { flexDirection: 'row', gap: 8 },
  hudChip: { flex: 1, minHeight: 58, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 9, backgroundColor: colors.white, justifyContent: 'space-between' },
  hudChipAlert: { backgroundColor: '#F7C4A5' },
  hudLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 15 },
  hudValue: { color: colors.black, fontSize: 18, fontWeight: '900' },
  eventBanner: { marginTop: 10, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.yellow, padding: 12 },
  eventTitle: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 20 },
  eventBody: { marginTop: 3, color: colors.black, fontSize: 13, fontWeight: '800' },
  darkPanel: { marginTop: 22, backgroundColor: colors.black, borderRadius: 8, padding: 16 },
  darkEyebrow: { color: colors.yellow, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  darkTitle: { marginTop: 8, color: colors.yellow, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30 },
  darkBody: { marginTop: 9, color: colors.white, fontSize: 14, lineHeight: 21, fontWeight: '700' },
  panel: { marginTop: 18, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 14, backgroundColor: 'rgba(255,255,255,0.2)' },
  sectionTitle: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 23 },
  locationRow: { marginTop: 10, minHeight: 70, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'space-between', gap: 12, backgroundColor: colors.white },
  selectedRow: { backgroundColor: colors.yellow },
  lockedRow: { opacity: 0.48 },
  rowTitle: { color: colors.black, fontSize: 15, fontWeight: '900' },
  rowBody: { marginTop: 4, color: colors.black, fontSize: 12, lineHeight: 17, fontWeight: '700' },
  rowToken: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  costPanel: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 14, backgroundColor: colors.white },
  costLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 19 },
  costValue: { color: colors.black, fontSize: 20, fontWeight: '900' },
  primaryButton: { marginTop: 20, minHeight: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.yellow, borderRadius: 27, borderWidth: 2, borderColor: colors.black, paddingHorizontal: 16 },
  primaryButtonText: { color: colors.buttonText, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  disabledButton: { opacity: 0.48 },
  inventoryGrid: { marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  shopGrid: { marginTop: 18, gap: 12 },
  shopCard: { borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 14, backgroundColor: 'rgba(255,255,255,0.18)' },
  shopCardReady: { backgroundColor: colors.yellow },
  shopTitle: { color: colors.black, fontWeight: '900', fontSize: 16 },
  shopBody: { marginTop: 6, color: colors.black, fontSize: 13, lineHeight: 19, fontWeight: '700' },
  shopMeta: { marginTop: 9, color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  mixerScene: { marginTop: 20, minHeight: 180, borderWidth: 3, borderColor: colors.black, borderRadius: 8, backgroundColor: '#8AD16D', padding: 18, flexDirection: 'row', gap: 18, alignItems: 'center' },
  pitcher: { width: 96, height: 132, borderWidth: 3, borderColor: colors.black, borderRadius: 12, backgroundColor: colors.white, justifyContent: 'flex-end', overflow: 'hidden' },
  pitcherFill: { width: '100%', backgroundColor: '#F8E27A' },
  ingredientBins: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ingredientDot: { width: '45%', minHeight: 66, borderWidth: 2, borderColor: colors.black, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  ingredientDotValue: { color: colors.black, fontSize: 18, fontWeight: '900' },
  ingredientDotLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 15 },
  stepper: { marginTop: 13, minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  stepperLabel: { color: colors.black, fontSize: 14, fontWeight: '900' },
  stepperValue: { marginTop: 2, color: colors.black, fontSize: 20, fontWeight: '900' },
  stepperControls: { flexDirection: 'row', gap: 8 },
  stepperButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.yellow, borderRadius: 22, borderWidth: 2, borderColor: colors.black },
  stepperButtonText: { color: colors.black, fontSize: 22, fontWeight: '900' },
  warningText: { marginTop: 12, color: colors.negative, fontWeight: '900', lineHeight: 20 },
  resultGrid: { marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  resultBox: { width: '47%', minHeight: 78, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 12, justifyContent: 'space-between', backgroundColor: colors.white },
  resultBoxLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 17 },
  resultBoxValue: { color: colors.black, fontWeight: '900', fontSize: 19 },
  threeScene: { marginTop: 12, height: 200 },
  gameYard: { flex: 1, marginTop: 12, minHeight: 388, overflow: 'hidden', borderWidth: 3, borderColor: colors.black, borderRadius: 8, backgroundColor: '#8AD16D' },
  sky: { height: 98, backgroundColor: '#9DD7F2' },
  sun: { position: 'absolute', top: 20, right: 36, width: 46, height: 46, borderRadius: 23, borderWidth: 3, borderColor: colors.black, backgroundColor: colors.yellow },
  cloud: { position: 'absolute', top: 24, left: 34, width: 72, height: 36, borderRadius: 18, borderWidth: 3, borderColor: colors.black, backgroundColor: colors.white },
  cloudPuffLarge: { position: 'absolute', top: -13, left: 14, width: 34, height: 34, borderRadius: 17, borderWidth: 3, borderColor: colors.black, backgroundColor: colors.white },
  cloudPuffSmall: { position: 'absolute', top: -5, right: 8, width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: colors.black, backgroundColor: colors.white },
  stand: { position: 'absolute', left: '18%', right: '18%', bottom: 34, height: 150, alignItems: 'center' },
  awning: { width: '100%', height: 34, borderWidth: 3, borderColor: colors.black, backgroundColor: colors.yellow, borderRadius: 8 },
  standTitle: { marginTop: -2, width: '88%', textAlign: 'center', color: colors.yellow, backgroundColor: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 25, paddingVertical: 8 },
  counter: { width: '78%', height: 52, borderWidth: 3, borderColor: colors.black, backgroundColor: '#8B5A2B', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  cup: { width: 18, height: 25, borderRadius: 4, borderWidth: 2, borderColor: colors.black, backgroundColor: '#F8E27A' },
  customer: { position: 'absolute', bottom: 192, width: 54, alignItems: 'center' },
  customerHead: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: colors.black },
  customerBody: { marginTop: -2, width: 38, height: 42, borderRadius: 8, borderWidth: 2, borderColor: colors.black, backgroundColor: colors.white },
  customerOrder: { position: 'absolute', top: -16, minWidth: 34, textAlign: 'center', color: colors.black, backgroundColor: colors.yellow, borderWidth: 2, borderColor: colors.black, borderRadius: 12, overflow: 'hidden', fontWeight: '900' },
  talkBubble: { marginTop: 2, color: colors.yellow, backgroundColor: colors.black, overflow: 'hidden', borderRadius: 10, paddingHorizontal: 6, fontFamily: 'BebasNeue_400Regular', fontSize: 13 },
  customerTalkOverlay: { position: 'absolute', bottom: 10, width: '20%', minHeight: 52, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 5, backgroundColor: colors.white },
  customerTalkName: { color: colors.black, fontSize: 12, fontWeight: '900' },
  customerTalkMeta: { marginTop: 2, color: colors.black, fontSize: 10, fontWeight: '800', textTransform: 'capitalize' },
  shopStatusPanel: { marginTop: 8, flexDirection: 'row', gap: 8 },
  shopStatusItem: { flex: 1, minHeight: 52, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.white, padding: 8, justifyContent: 'space-between' },
  shopStatusLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 14 },
  shopStatusValue: { color: colors.black, fontSize: 17, fontWeight: '900' },
  customerQueuePanel: { marginTop: 10, gap: 8 },
  customerQueueTitle: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 19 },
  emptyQueuePanel: { marginTop: 10, padding: 14, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center' },
  emptyQueueText: { color: colors.black, fontSize: 13, fontWeight: '800' },
  customerCard: { borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.white, padding: 10, gap: 8 },
  customerCardActive: { borderColor: colors.yellow, borderWidth: 3 },
  customerCardAngry: { borderColor: colors.negative },
  customerCardRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  customerAvatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  customerAvatarLetter: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  customerCardMeta: { flex: 1, gap: 4 },
  customerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  customerCardName: { color: colors.black, fontSize: 14, fontWeight: '900' },
  personalityTag: { backgroundColor: colors.black, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  personalityTagText: { color: colors.yellow, fontFamily: 'BebasNeue_400Regular', fontSize: 11 },
  customerOrderLabel: { color: colors.black, fontSize: 12, fontWeight: '800' },
  customerPatienceTrack: { height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.12)' },
  customerPatienceFill: { height: '100%', borderRadius: 3, backgroundColor: colors.positive },
  speechBubble: { backgroundColor: '#F5F0DC', borderWidth: 1.5, borderColor: colors.black, borderRadius: 8, padding: 9 },
  speechBubbleAngry: { backgroundColor: '#F9DDD9' },
  speechBubbleText: { color: colors.black, fontSize: 13, lineHeight: 19, fontWeight: '800' },
  customerCardActions: { flexDirection: 'row', gap: 8 },
  talkBtn: { flex: 1, height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.black, borderRadius: 18, backgroundColor: colors.white },
  talkBtnActive: { backgroundColor: colors.yellow },
  talkBtnText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
  serveBtn: { flex: 1, height: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.black, borderRadius: 18, backgroundColor: colors.yellow },
  serveBtnText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
  patienceTrack: { marginTop: 5, width: 50, height: 8, borderWidth: 1, borderColor: colors.black, backgroundColor: colors.white },
  patienceFill: { height: '100%', backgroundColor: colors.positive },
  patienceDanger: { backgroundColor: colors.negative },
  floatText: { position: 'absolute', color: colors.yellow, backgroundColor: colors.black, borderRadius: 12, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3, fontWeight: '900' },
  playFooter: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  comboLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  comboValue: { color: colors.black, fontWeight: '900', fontSize: 27 },
  endButton: { minWidth: 148, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black, borderRadius: 25 },
  endButtonText: { color: colors.yellow, fontFamily: 'BebasNeue_400Regular', fontSize: 21 },
  stationBar: { marginTop: 10, flexDirection: 'row', gap: 6 },
  stationButton: { flex: 1, minHeight: 64, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.yellow, paddingHorizontal: 4 },
  stationButtonCooling: { backgroundColor: colors.white, opacity: 0.78 },
  stationIcon: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
  stationButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 14 },
  stationCooldown: { color: colors.black, fontSize: 10, fontWeight: '900' },
  workerPanel: { marginTop: 10, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.22)', padding: 10 },
  workerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  workerSlots: { color: colors.black, fontSize: 13, fontWeight: '900' },
  workerRow: { marginTop: 8, minHeight: 52, borderTopWidth: 1, borderTopColor: colors.black, paddingTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  workerInfo: { flex: 1 },
  workerMeta: { marginTop: 3, color: colors.black, fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  workerStatBlock: { width: 74, alignItems: 'flex-end' },
  staminaTrack: { marginTop: 5, width: 64, height: 8, borderWidth: 1, borderColor: colors.black, backgroundColor: colors.white },
  staminaFill: { height: '100%', backgroundColor: colors.positive },
  hireRow: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  hireButton: { minHeight: 34, borderWidth: 2, borderColor: colors.black, borderRadius: 17, backgroundColor: colors.white, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  hireButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 15 },
  objectiveRow: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  objectiveChip: { flexGrow: 1, minHeight: 38, borderWidth: 2, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.white, padding: 7 },
  objectiveComplete: { backgroundColor: colors.yellow },
  objectiveText: { color: colors.black, fontSize: 11, fontWeight: '900' },
  objectiveProgress: { marginTop: 2, color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 14 },
  dialoguePanel: { position: 'absolute', left: 16, right: 16, borderWidth: 3, borderColor: colors.black, borderRadius: 8, backgroundColor: colors.white, padding: 12 },
  dialogueHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  dialogueTitle: { color: colors.black, fontWeight: '900', fontSize: 15, textTransform: 'capitalize' },
  dialogueClose: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 17 },
  dialoguePrompt: { marginTop: 10, color: colors.black, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  customerResponse: { marginTop: 8, color: colors.positive, fontSize: 13, lineHeight: 19, fontWeight: '900' },
  replyInput: { marginTop: 10, minHeight: 58, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 10, color: colors.black, backgroundColor: colors.green, fontWeight: '800' },
  dialogueActions: { marginTop: 10, flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.black, borderRadius: 22, backgroundColor: colors.white },
  secondaryButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 19 },
  yellowMiniButton: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.black, borderRadius: 22, backgroundColor: colors.yellow },
  yellowMiniButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 19 },
  reviewList: { marginTop: 18, gap: 12 },
  reviewCard: { borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 14, backgroundColor: colors.white },
  reviewTopline: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  reviewName: { color: colors.black, fontWeight: '900', fontSize: 15 },
  reviewStars: { color: colors.yellow, fontWeight: '900', fontSize: 15 },
  reviewText: { marginTop: 8, color: colors.black, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  reviewMeta: { marginTop: 8, color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 17 },
  milestoneRow: { marginTop: 10, minHeight: 46, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.black, paddingTop: 10 },
});
