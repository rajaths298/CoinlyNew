import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
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
import {
  applyStartupAction,
  chooseStartupArchetype,
  closeStartupMonth,
  continueStartupTurn,
  createInitialStartupSession,
  getStartupActionCost,
  getStartupArchetype,
  getStartupDebtService,
  getStartupEvent,
  getStartupGrossMargin,
  getStartupMonthlyBurn,
  normalizeStartupSession,
  resolveStartupFunding,
  resolveStartupReview,
  startupActionCatalog,
  startupArchetypeCatalog,
  startupFundingCatalog,
  startupLogoPalettes,
  startupLogoShapes,
  toStartupGameResult,
  updateStartupLogo,
} from '../engine/startupStoryEngine';
import { appColors as colors } from '../theme';
import { useTutorial } from '../hooks/useTutorial';
import TutorialOverlay from '../components/tutorial/TutorialOverlay';
import TutorialEntryModal from '../components/tutorial/TutorialEntryModal';
import TutorialHelpButton from '../components/tutorial/TutorialHelpButton';
import type { TutorialStep } from '../components/tutorial/types';
import type {
  GameDefinition,
  GameResult,
  StartupActionId,
  StartupArchetypeId,
  StartupFundingId,
  StartupLogoPalette,
  StartupLogoShape,
  StartupReview,
  StartupSession,
  StartupTurnLedger,
} from '../types/game';

type Props = {
  aiHeaderButton?: React.ReactNode;
  game: GameDefinition;
  startupSession?: StartupSession;
  onBack: () => void;
  onComplete: (result: GameResult) => void;
  onUpdateStartupSession?: (session: StartupSession) => void;
};

export default function StartupStoryScreen({
  aiHeaderButton,
  game,
  startupSession,
  onBack,
  onComplete,
  onUpdateStartupSession,
}: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold, BebasNeue_400Regular });
  const [session, setSession] = useState<StartupSession>(() => (
    normalizeStartupSession(startupSession ?? createInitialStartupSession())
  ));
  const [selectedArchetype, setSelectedArchetype] = useState<StartupArchetypeId>('saas');
  const [companyName, setCompanyName] = useState('Signal Studio');
  const completionLogged = useRef(false);

  useEffect(() => {
    onUpdateStartupSession?.(session);
  }, [onUpdateStartupSession, session]);

  useEffect(() => {
    if (session.status === 'playing' || completionLogged.current) return;
    completionLogged.current = true;
    onComplete(toStartupGameResult(session, game.competency));
  }, [game.competency, onComplete, session]);

  const scrollRef = useRef<ScrollView>(null);
  const archetypeRef = useRef<View>(null);
  const startRef = useRef<View>(null);
  const runwayRef = useRef<View>(null);
  const strategyRef = useRef<View>(null);
  const closeRef = useRef<View>(null);
  const ledgerRef = useRef<View>(null);
  const tutorialSteps = useMemo<TutorialStep[]>(() => [
    { id: 'archetype', targetRef: archetypeRef, heading: 'Pick your model', body: 'Choose a business model — each starts with different cash, margins, and risks.' },
    { id: 'start', targetRef: startRef, actionGated: true, heading: 'Launch it', body: 'Give it a name if you like, then start your company.' },
    { id: 'runway', targetRef: runwayRef, heading: 'Mind your runway', body: 'These are your vital signs. Runway is how many months of cash you have left — never let it hit zero.' },
    { id: 'strategy', targetRef: strategyRef, actionGated: true, heading: 'Make a move', body: 'Each month you pick one strategy move. Some spend cash to grow, others bring money in.' },
    { id: 'close', targetRef: closeRef, actionGated: true, heading: 'Close the month', body: 'Locked in your move? Close the month to see how it plays out.' },
    { id: 'ledger', targetRef: ledgerRef, heading: 'See the outcome', body: 'Here is the result and the lesson behind it. Keep making smart calls to reach durable profit!' },
  ], []);
  const tutorial = useTutorial(game.id, tutorialSteps);

  // Action-gated steps advance as the founder loop progresses.
  useEffect(() => {
    if (!tutorial.isActive) return;
    if (session.phase !== 'setup') tutorial.completeStep('start');
    if (session.actionTakenThisMonth) tutorial.completeStep('strategy');
    if (session.phase === 'ledger' || session.phase === 'result') tutorial.completeStep('close');
  }, [session.phase, session.actionTakenThisMonth, tutorial]);

  if (!fontsLoaded) return null;

  const startCompany = () => {
    setSession((current) => chooseStartupArchetype(current, selectedArchetype, companyName));
  };

  const commitAction = (actionId: StartupActionId) => {
    setSession((current) => applyStartupAction(current, actionId));
  };

  const chooseFunding = (fundingId: StartupFundingId) => {
    setSession((current) => resolveStartupFunding(current, fundingId));
  };

  const updateLogo = (updates: Partial<{ shape: StartupLogoShape; palette: StartupLogoPalette; wordmark: string }>) => {
    setSession((current) => updateStartupLogo(current, updates));
  };

  const resolveReview = (reviewId: string) => {
    setSession((current) => resolveStartupReview(current, reviewId));
  };

  const closeMonth = () => {
    setSession((current) => closeStartupMonth(current));
  };

  const continueTurn = () => {
    setSession((current) => continueStartupTurn(current));
  };

  const restart = () => {
    completionLogged.current = false;
    setCompanyName('Signal Studio');
    setSelectedArchetype('saas');
    setSession(createInitialStartupSession());
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inlineHeader}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.75}>
            <Text style={styles.headerAction}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.wordmark}>Coinly</Text>
          <View style={styles.headerRightActions}>
            <Text style={styles.headerAction}>GAME</Text>
            <TutorialHelpButton onPress={tutorial.reset} />
            {aiHeaderButton}
          </View>
        </View>

        {session.phase === 'setup' ? (
          <SetupPanel
            companyName={companyName}
            selectedArchetype={selectedArchetype}
            onChangeCompanyName={setCompanyName}
            onSelectArchetype={setSelectedArchetype}
            onStart={startCompany}
            archetypeRef={archetypeRef}
            startRef={startRef}
          />
        ) : null}

        {session.phase !== 'setup' && session.phase !== 'result' ? (
          <FounderDashboard
            session={session}
            onCommitAction={commitAction}
            onChooseFunding={chooseFunding}
            onUpdateLogo={updateLogo}
            onResolveReview={resolveReview}
            onCloseMonth={closeMonth}
            onContinueTurn={continueTurn}
            runwayRef={runwayRef}
            strategyRef={strategyRef}
            closeRef={closeRef}
            ledgerRef={ledgerRef}
          />
        ) : null}

        {session.phase === 'result' ? (
          <ResultPanel session={session} onBack={onBack} onRestart={restart} />
        ) : null}
      </ScrollView>
      <TutorialEntryModal
        visible={tutorial.showEntryModal}
        gameTitle={game.title}
        onYes={tutorial.startTutorial}
        onSkip={tutorial.skip}
      />
      <TutorialOverlay
        step={tutorial.currentStep}
        stepIndex={tutorial.stepIndex}
        totalSteps={tutorial.totalSteps}
        onAdvance={tutorial.advance}
        onSkip={tutorial.skip}
        scrollRef={scrollRef}
      />
    </View>
  );
}

function SetupPanel({
  companyName,
  selectedArchetype,
  onChangeCompanyName,
  onSelectArchetype,
  onStart,
  archetypeRef,
  startRef,
}: {
  companyName: string;
  selectedArchetype: StartupArchetypeId;
  onChangeCompanyName: (value: string) => void;
  onSelectArchetype: (value: StartupArchetypeId) => void;
  onStart: () => void;
  archetypeRef?: React.RefObject<View | null>;
  startRef?: React.RefObject<View | null>;
}) {
  return (
    <View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>STARTUP STORY</Text>
        <Text style={styles.title}>Build a real business, not just a big idea.</Text>
        <Text style={styles.body}>
          Pick a model, protect runway, test demand, manage dilution and debt, and reach durable profit.
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Company</Text>
        <TextInput
          style={styles.nameInput}
          value={companyName}
          onChangeText={onChangeCompanyName}
          placeholder="Company name"
          placeholderTextColor="#8A8F7A"
          maxLength={32}
        />
      </View>

      <View style={styles.archetypeGrid} ref={archetypeRef}>
        {startupArchetypeCatalog.map((archetype) => {
          const selected = selectedArchetype === archetype.id;
          return (
            <TouchableOpacity
              key={archetype.id}
              style={[styles.archetypeCard, selected && styles.archetypeCardSelected]}
              activeOpacity={0.84}
              onPress={() => onSelectArchetype(archetype.id)}
            >
              <View style={[styles.archetypeStripe, { backgroundColor: archetype.color }]} />
              <Text style={styles.cardLabel}>{archetype.subtitle.toUpperCase()}</Text>
              <Text style={styles.cardTitle}>{archetype.title}</Text>
              <Text style={styles.cardBody}>{archetype.description}</Text>
              <View style={styles.smallStatRow}>
                <SmallStat label="Cash" value={formatMoney(archetype.startingCash)} />
                <SmallStat label="Margin" value={`${Math.round(archetype.grossMargin * 100)}%`} />
                <SmallStat label="Churn" value={`${archetype.churn}%`} />
              </View>
              <Text style={styles.cardFinePrint}>{archetype.strengths.join(' / ')}</Text>
              <Text style={styles.cardWarning}>{archetype.warnings.join(' / ')}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View ref={startRef}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onStart}>
          <Text style={styles.primaryButtonText}>START COMPANY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FounderDashboard({
  session,
  onCommitAction,
  onChooseFunding,
  onUpdateLogo,
  onResolveReview,
  onCloseMonth,
  onContinueTurn,
  runwayRef,
  strategyRef,
  closeRef,
  ledgerRef,
}: {
  session: StartupSession;
  onCommitAction: (actionId: StartupActionId) => void;
  onChooseFunding: (fundingId: StartupFundingId) => void;
  onUpdateLogo: (updates: Partial<{ shape: StartupLogoShape; palette: StartupLogoPalette; wordmark: string }>) => void;
  onResolveReview: (reviewId: string) => void;
  onCloseMonth: () => void;
  onContinueTurn: () => void;
  runwayRef?: React.RefObject<View | null>;
  strategyRef?: React.RefObject<View | null>;
  closeRef?: React.RefObject<View | null>;
  ledgerRef?: React.RefObject<View | null>;
}) {
  const archetype = session.archetypeId ? getStartupArchetype(session.archetypeId) : startupArchetypeCatalog[0];
  const event = getStartupEvent(session);
  const grossMargin = getStartupGrossMargin(session);
  const monthlyBurn = getStartupMonthlyBurn(session);
  const committedCash = session.cash + session.pendingFunding - session.pendingSpend;

  return (
    <View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{archetype.title.toUpperCase()} / MONTH {Math.min(session.month, session.maxMonths)}</Text>
        <Text style={styles.title}>{session.companyName}</Text>
        <Text style={styles.body}>{session.message}</Text>
      </View>

      <BusinessScene session={session} />

      {session.phase === 'ledger' && session.lastLedger ? (
        <View ref={ledgerRef}>
          <LedgerPanel ledger={session.lastLedger} onContinue={onContinueTurn} />
        </View>
      ) : null}

      <View style={styles.hudGrid} ref={runwayRef}>
        <MetricCard label="Cash" value={formatMoney(session.cash)} alert={session.cash < session.monthlyCosts * 1.5} />
        <MetricCard label="Runway" value={`${session.runwayMonths} mo`} alert={session.runwayMonths < 3} />
        <MetricCard label="Revenue" value={formatMoney(session.revenue)} />
        <MetricCard label="Burn" value={formatMoney(monthlyBurn)} alert={monthlyBurn > session.revenue} />
        <MetricCard label="Customers" value={`${session.customerCount}`} />
        <MetricCard label="Margin" value={`${Math.round(grossMargin * 100)}%`} />
        <MetricCard label="Churn" value={`${session.churn}%`} alert={session.churn > 22} />
        <MetricCard label="Morale" value={`${session.morale}/100`} alert={session.morale < 35} />
        <MetricCard label="Ownership" value={`${Math.round(session.ownership)}%`} alert={session.ownership < 55} />
        <MetricCard label="Risk" value={`${session.risk}/120`} alert={session.risk > 82} />
      </View>

      <View style={styles.stagePanel}>
        <View style={styles.stageHeader}>
          <Text style={styles.panelEyebrow}>STAGE</Text>
          <Text style={styles.stageLabel}>{getStageLabel(session.stage)}</Text>
        </View>
        <ProgressBar percent={(session.profitableStreak / 3) * 100} />
        <Text style={styles.stageBody}>
          Profit streak {session.profitableStreak}/3. Durable profit also needs cash, acceptable churn, runway, and controlled risk.
        </Text>
      </View>

      <BrandStudio session={session} onUpdateLogo={onUpdateLogo} />

      <View style={styles.darkPanel}>
        <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>MARKET EVENT</Text>
        <Text style={styles.darkTitle}>{event.title}</Text>
        <Text style={styles.darkBody}>{event.description}</Text>
        <Text style={styles.darkLesson}>{event.lesson}</Text>
      </View>

      <CustomerReviewPanel session={session} onResolveReview={onResolveReview} />

      <View style={styles.panel} ref={strategyRef}>
        <View style={styles.panelHeaderRow}>
          <Text style={styles.sectionTitle}>Strategy Move</Text>
          <Text style={styles.panelMeta}>{session.actionTakenThisMonth ? 'COMMITTED' : 'CHOOSE 1'}</Text>
        </View>
        <View style={styles.actionGrid}>
          {startupActionCatalog.map((action) => {
            const cost = getStartupActionCost(session, action.id);
            const disabled = session.phase === 'ledger' || session.actionTakenThisMonth || committedCash < cost;
            const selected = session.activeDecisionId === action.id;
            return (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, selected && styles.actionCardSelected, disabled && !selected && styles.cardDisabled]}
                activeOpacity={0.82}
                disabled={disabled}
                onPress={() => onCommitAction(action.id)}
              >
                <View style={[styles.actionAccent, { backgroundColor: action.accent }]} />
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionBody}>{action.description}</Text>
                <Text style={styles.actionCost}>{cost > 0 ? `${formatMoney(cost)} committed` : 'No cash cost'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeaderRow}>
          <Text style={styles.sectionTitle}>Capital Choice</Text>
          <Text style={styles.panelMeta}>{session.fundingTakenThisMonth ? 'LOCKED' : 'OPTIONAL'}</Text>
        </View>
        <View style={styles.fundingGrid}>
          {startupFundingCatalog.map((funding) => {
            const selected = session.activeFundingId === funding.id;
            const disabled = session.phase === 'ledger' || session.fundingTakenThisMonth;
            return (
              <TouchableOpacity
                key={funding.id}
                style={[styles.fundingCard, selected && styles.fundingCardSelected, disabled && !selected && styles.cardDisabled]}
                activeOpacity={0.82}
                disabled={disabled}
                onPress={() => onChooseFunding(funding.id)}
              >
                <View style={[styles.fundingDot, { backgroundColor: funding.accent }]} />
                <Text style={styles.fundingTitle}>{funding.title}</Text>
                <Text style={styles.fundingBody}>{funding.description}</Text>
                <Text style={styles.fundingTradeoff}>{funding.tradeoff}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.capitalPanel}>
        <SmallStat label="Committed Cash" value={formatMoney(committedCash)} />
        <SmallStat label="Pending Spend" value={formatMoney(session.pendingSpend)} />
        <SmallStat label="Pending Funding" value={formatMoney(session.pendingFunding)} />
        <SmallStat label="Debt Service" value={formatMoney(getStartupDebtService(session))} />
      </View>

      {session.phase !== 'ledger' ? (
        <View ref={closeRef}>
          <TouchableOpacity
            style={[styles.primaryButton, !session.actionTakenThisMonth && styles.primaryButtonDisabled]}
            activeOpacity={0.86}
            disabled={!session.actionTakenThisMonth}
            onPress={onCloseMonth}
          >
            <Text style={styles.primaryButtonText}>{session.actionTakenThisMonth ? 'CLOSE MONTH' : 'CHOOSE STRATEGY FIRST'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <MilestonePanel session={session} />
      <HistoryPanel ledger={session.ledger} />
    </View>
  );
}

function BusinessScene({ session }: { session: StartupSession }) {
  const palette = getLogoPalette(session.logo.palette);
  const openReviews = session.reviews.filter((review) => !review.resolved).length;
  const averageStars = getAverageStars(session.reviews);
  const visibleCustomers = buildVisualCustomers(session);
  const archetype = session.archetypeId ? getStartupArchetype(session.archetypeId) : startupArchetypeCatalog[0];

  return (
    <View style={styles.scenePanel}>
      <View style={styles.sceneHeader}>
        <LogoMark session={session} size="large" />
        <View style={styles.sceneHeaderCopy}>
          <Text style={styles.sceneTitle}>{session.companyName}</Text>
          <Text style={styles.sceneSubtitle}>{archetype.subtitle} / {session.customerSatisfaction}/100 customer trust</Text>
        </View>
      </View>

      <View style={[styles.businessCanvas, { borderColor: palette.primary }]}>
        <View style={styles.canvasSkyline}>
          <BusinessBuilding session={session} />
          <View style={styles.metricBillboard}>
            <Text style={styles.billboardLabel}>LIVE OPS</Text>
            <Text style={styles.billboardValue}>{formatMoney(session.revenue)}</Text>
            <Text style={styles.billboardBody}>monthly revenue</Text>
          </View>
        </View>
        <View style={styles.customerStreet}>
          {visibleCustomers.map((customer) => (
            <CustomerAvatar
              key={customer.id}
              initials={customer.initials}
              mood={customer.mood}
              label={customer.label}
            />
          ))}
        </View>
      </View>

      <View style={styles.sceneStats}>
        <SmallStat label="Reviews" value={session.reviews.length ? `${averageStars}/5` : 'New'} />
        <SmallStat label="Open Issues" value={`${openReviews}`} />
        <SmallStat label="Brand" value={`${session.brand}/100`} />
      </View>
    </View>
  );
}

function BusinessBuilding({ session }: { session: StartupSession }) {
  if (session.archetypeId === 'local-service') {
    return (
      <View style={styles.storefront}>
        <View style={styles.awningRow}>
          {[0, 1, 2, 3].map((item) => <View key={item} style={[styles.awningPanel, item % 2 === 0 && styles.awningPanelAlt]} />)}
        </View>
        <View style={styles.shopWindowRow}>
          <View style={styles.shopWindow}><Text style={styles.windowText}>BOOK</Text></View>
          <View style={styles.shopDoor}><LogoMark session={session} size="small" /></View>
          <View style={styles.shopWindow}><Text style={styles.windowText}>SERVE</Text></View>
        </View>
        <View style={styles.serviceVan}>
          <Text style={styles.vanText}>{session.logo.wordmark}</Text>
          <View style={styles.vanWheelRow}><View style={styles.vanWheel} /><View style={styles.vanWheel} /></View>
        </View>
      </View>
    );
  }

  if (session.archetypeId === 'product-brand') {
    return (
      <View style={styles.productShelf}>
        <View style={styles.packageHero}>
          <LogoMark session={session} size="small" />
          <Text style={styles.packageLabel}>DROP</Text>
        </View>
        <View style={styles.shelfRows}>
          {[0, 1, 2].map((row) => (
            <View key={row} style={styles.shelfRow}>
              {[0, 1, 2, 3].map((box) => <View key={box} style={styles.productBox} />)}
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.officeTower}>
      <View style={styles.officeSign}>
        <LogoMark session={session} size="small" />
        <Text style={styles.officeSignText}>HQ</Text>
      </View>
      <View style={styles.officeGrid}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <View key={item} style={[styles.officeWindow, item % 3 === 0 && styles.officeWindowLit]} />
        ))}
      </View>
      <View style={styles.dashboardBars}>
        <View style={[styles.dashboardBar, { height: 20 + session.productQuality * 0.18 }]} />
        <View style={[styles.dashboardBar, { height: 16 + session.brand * 0.16 }]} />
        <View style={[styles.dashboardBar, { height: 14 + session.customerSatisfaction * 0.15 }]} />
      </View>
    </View>
  );
}

function BrandStudio({
  session,
  onUpdateLogo,
}: {
  session: StartupSession;
  onUpdateLogo: (updates: Partial<{ shape: StartupLogoShape; palette: StartupLogoPalette; wordmark: string }>) => void;
}) {
  return (
    <View style={styles.brandStudio}>
      <View style={styles.panelHeaderRow}>
        <Text style={styles.sectionTitle}>Brand Studio</Text>
        <Text style={styles.panelMeta}>LOGO</Text>
      </View>
      <View style={styles.brandPreviewRow}>
        <LogoMark session={session} size="hero" />
        <View style={styles.brandControls}>
          <Text style={styles.controlLabel}>WORDMARK</Text>
          <TextInput
            style={styles.wordmarkInput}
            value={session.logo.wordmark}
            onChangeText={(value) => onUpdateLogo({ wordmark: value })}
            maxLength={3}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <Text style={styles.controlLabel}>SHAPE</Text>
      <View style={styles.optionRow}>
        {startupLogoShapes.map((shape) => (
          <TouchableOpacity
            key={shape}
            style={[styles.logoOption, session.logo.shape === shape && styles.logoOptionActive]}
            activeOpacity={0.82}
            onPress={() => onUpdateLogo({ shape })}
          >
            <Text style={styles.logoOptionText}>{shape.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.controlLabel}>PALETTE</Text>
      <View style={styles.optionRow}>
        {startupLogoPalettes.map((paletteId) => {
          const palette = getLogoPalette(paletteId);
          return (
            <TouchableOpacity
              key={paletteId}
              style={[styles.paletteOption, session.logo.palette === paletteId && styles.logoOptionActive]}
              activeOpacity={0.82}
              onPress={() => onUpdateLogo({ palette: paletteId })}
            >
              <View style={[styles.paletteSwatch, { backgroundColor: palette.primary }]} />
              <View style={[styles.paletteSwatch, { backgroundColor: palette.secondary }]} />
              <Text style={styles.paletteText}>{paletteId.toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function CustomerReviewPanel({
  session,
  onResolveReview,
}: {
  session: StartupSession;
  onResolveReview: (reviewId: string) => void;
}) {
  const recentReviews = session.reviews.slice(0, 5);
  const unresolved = recentReviews.filter((review) => !review.resolved).length;
  return (
    <View style={styles.reviewPanel}>
      <View style={styles.panelHeaderRow}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <Text style={styles.panelMeta}>{unresolved} OPEN</Text>
      </View>
      <View style={styles.reviewScoreRow}>
        <SmallStat label="Average" value={session.reviews.length ? `${getAverageStars(session.reviews)}/5` : 'New'} />
        <SmallStat label="Trust" value={`${session.customerSatisfaction}/100`} />
        <SmallStat label="Retention" value={`${session.retention}%`} />
      </View>
      {recentReviews.map((review) => (
        <ReviewCard key={review.id} review={review} onResolve={() => onResolveReview(review.id)} />
      ))}
    </View>
  );
}

function ReviewCard({ review, onResolve }: { review: StartupReview; onResolve: () => void }) {
  return (
    <View style={[styles.reviewCard, review.resolved && styles.reviewCardResolved]}>
      <View style={[styles.reviewMoodStripe, { backgroundColor: getMoodColor(review.mood) }]} />
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewName}>{review.customerName}</Text>
          <Text style={styles.reviewMeta}>{review.segment.toUpperCase()} / {review.issue.toUpperCase()}</Text>
        </View>
        <Text style={styles.reviewStars}>{review.stars}/5</Text>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <TouchableOpacity
        style={[styles.fixReviewButton, review.resolved && styles.fixReviewButtonDone]}
        activeOpacity={0.82}
        disabled={review.resolved}
        onPress={onResolve}
      >
        <Text style={styles.fixReviewButtonText}>{review.resolved ? 'RESOLVED' : 'FIX REVIEW'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function LogoMark({ session, size }: { session: StartupSession; size: 'small' | 'large' | 'hero' }) {
  const palette = getLogoPalette(session.logo.palette);
  const dimension = size === 'hero' ? 112 : size === 'large' ? 72 : 42;
  const shapeStyle = session.logo.shape === 'badge'
    ? { borderRadius: 12 }
    : session.logo.shape === 'orbit'
      ? { borderRadius: dimension / 2 }
      : session.logo.shape === 'spark'
        ? { borderRadius: 4, transform: [{ rotate: '8deg' }] }
        : { borderRadius: 2 };

  return (
    <View
      style={[
        styles.logoMark,
        {
          width: dimension,
          height: dimension,
          backgroundColor: palette.primary,
          borderColor: palette.text,
        },
        shapeStyle,
      ]}
    >
      <View style={[styles.logoInnerShape, { backgroundColor: palette.secondary }]} />
      <Text
        style={[
          styles.logoWordmark,
          {
            color: palette.text,
            fontSize: size === 'hero' ? 34 : size === 'large' ? 25 : 15,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {session.logo.wordmark}
      </Text>
    </View>
  );
}

function CustomerAvatar({ initials, mood, label }: { initials: string; mood: StartupReview['mood']; label: string }) {
  return (
    <View style={styles.customerAvatarWrap}>
      <View style={[styles.customerAvatar, { borderColor: getMoodColor(mood) }]}>
        <Text style={styles.customerInitials}>{initials}</Text>
      </View>
      <Text style={styles.customerLabel}>{label}</Text>
    </View>
  );
}

function LedgerPanel({ ledger, onContinue }: { ledger: StartupTurnLedger; onContinue: () => void }) {
  return (
    <View style={styles.ledgerPanel}>
      <Text style={styles.panelEyebrow}>MONTH {ledger.month} LEDGER</Text>
      <Text style={styles.ledgerTitle}>{ledger.title}</Text>
      <View style={styles.resultGrid}>
        <ResultBox label="Revenue" value={formatMoney(ledger.revenue)} />
        <ResultBox label="Costs" value={formatMoney(ledger.costs)} />
        <ResultBox label="Net" value={`${ledger.netProfit >= 0 ? '+' : ''}${formatMoney(ledger.netProfit)}`} />
        <ResultBox label="Runway" value={`${ledger.runwayMonths} mo`} />
      </View>
      <Text style={styles.ledgerBody}>{ledger.lesson}</Text>
      <Text style={styles.ledgerWhy}>{ledger.whyItMatters}</Text>
      <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.86} onPress={onContinue}>
        <Text style={styles.secondaryButtonText}>NEXT MONTH</Text>
      </TouchableOpacity>
    </View>
  );
}

function MilestonePanel({ session }: { session: StartupSession }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Milestones</Text>
      {session.milestones.map((milestone) => (
        <View key={milestone.id} style={styles.milestoneRow}>
          <View style={[styles.milestoneCheck, milestone.achieved && styles.milestoneCheckDone]}>
            <Text style={[styles.milestoneCheckText, milestone.achieved && styles.milestoneCheckTextDone]}>
              {milestone.achieved ? 'OK' : '--'}
            </Text>
          </View>
          <Text style={styles.milestoneTitle}>{milestone.title}</Text>
        </View>
      ))}
    </View>
  );
}

function HistoryPanel({ ledger }: { ledger: StartupTurnLedger[] }) {
  const recent = ledger.slice(-3).reverse();
  if (!recent.length) return null;
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Recent Months</Text>
      {recent.map((item) => (
        <View key={item.id} style={styles.historyRow}>
          <Text style={styles.historyMonth}>M{item.month}</Text>
          <View style={styles.historyCopy}>
            <Text style={styles.historyTitle}>{item.actionTitle} / {item.eventTitle}</Text>
            <Text style={styles.historyBody}>
              {formatMoney(item.revenue)} revenue, {formatMoney(item.cashAfter)} cash, {item.churnAfter}% churn
            </Text>
          </View>
          <Text style={[styles.historyProfit, item.netProfit < 0 && styles.historyProfitNegative]}>
            {item.netProfit >= 0 ? '+' : ''}{formatMoney(item.netProfit)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ResultPanel({
  session,
  onBack,
  onRestart,
}: {
  session: StartupSession;
  onBack: () => void;
  onRestart: () => void;
}) {
  const won = session.status === 'won';
  const profit = session.totalRevenue - session.totalCosts;
  return (
    <View>
      <View style={[styles.hero, won ? styles.winHero : styles.lossHero]}>
        <Text style={styles.eyebrow}>{won ? 'PROFITABLE COMPANY' : 'RUN COMPLETE'}</Text>
        <Text style={styles.title}>{session.companyName}</Text>
        <Text style={styles.body}>
          {won
            ? 'The business reached durable profitability with enough runway to keep choosing its future.'
            : 'The startup did not reach durable profit before a core constraint broke.'}
        </Text>
      </View>

      {session.lastLedger ? <LedgerSummary ledger={session.lastLedger} /> : null}

      <View style={styles.resultGrid}>
        <ResultBox label="Total Revenue" value={formatMoney(session.totalRevenue)} />
        <ResultBox label="Total Costs" value={formatMoney(session.totalCosts)} />
        <ResultBox label="Net Profit" value={`${profit >= 0 ? '+' : ''}${formatMoney(profit)}`} />
        <ResultBox label="Ownership" value={`${Math.round(session.ownership)}%`} />
        <ResultBox label="Cash" value={formatMoney(session.cash)} />
        <ResultBox label="Valuation" value={formatMoney(session.valuation)} />
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.86} onPress={onRestart}>
          <Text style={styles.secondaryButtonText}>RESTART</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onBack}>
          <Text style={styles.primaryButtonText}>BACK TO ARCADE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LedgerSummary({ ledger }: { ledger: StartupTurnLedger }) {
  return (
    <View style={styles.ledgerPanel}>
      <Text style={styles.panelEyebrow}>FINAL LESSON</Text>
      <Text style={styles.ledgerTitle}>{ledger.eventTitle}</Text>
      <Text style={styles.ledgerBody}>{ledger.lesson}</Text>
      <Text style={styles.ledgerWhy}>{ledger.whyItMatters}</Text>
    </View>
  );
}

function MetricCard({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <View style={[styles.metricCard, alert && styles.metricCardAlert]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.smallStat}>
      <Text style={styles.smallStatLabel}>{label}</Text>
      <Text style={styles.smallStatValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(4, Math.min(100, percent))}%` }]} />
    </View>
  );
}

function getLogoPalette(palette: StartupLogoPalette) {
  if (palette === 'mint') return { primary: '#77B7B2', secondary: '#E7F1DA', text: '#10241D' };
  if (palette === 'ocean') return { primary: '#6E9BC8', secondary: '#DDEAF4', text: '#10241D' };
  if (palette === 'ink') return { primary: '#10241D', secondary: '#F5C142', text: '#FFFDF4' };
  return { primary: '#DFAF3F', secondary: '#FFF8E1', text: '#10241D' };
}

function getAverageStars(reviews: StartupReview[]) {
  if (!reviews.length) return '0.0';
  const average = reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
  return average.toFixed(1);
}

function buildVisualCustomers(session: StartupSession) {
  const sourceReviews = session.reviews.length ? session.reviews.slice(0, 5) : [];
  if (sourceReviews.length) {
    return sourceReviews.map((review) => ({
      id: review.id,
      initials: review.customerName.slice(0, 2).toUpperCase(),
      mood: review.mood,
      label: review.resolved ? 'fixed' : `${review.stars}/5`,
    }));
  }

  const mood: StartupReview['mood'] = session.customerSatisfaction >= 75
    ? 'delighted'
    : session.customerSatisfaction >= 52
      ? 'satisfied'
      : session.customerSatisfaction >= 34
        ? 'frustrated'
        : 'at-risk';
  return ['A1', 'B2', 'C3'].map((initials, index) => ({
    id: `empty-${index}`,
    initials,
    mood,
    label: 'new',
  }));
}

function getMoodColor(mood: StartupReview['mood']) {
  if (mood === 'delighted') return colors.positive;
  if (mood === 'satisfied') return '#77B7B2';
  if (mood === 'frustrated') return colors.yellow;
  return colors.negative;
}

function getStageLabel(stage: StartupSession['stage']) {
  if (stage === 'idea') return 'Idea';
  if (stage === 'mvp') return 'MVP';
  if (stage === 'traction') return 'Traction';
  return 'Profitability';
}

function formatMoney(value: number) {
  const rounded = Math.round(value);
  if (Math.abs(rounded) >= 1000000) return `$${(rounded / 1000000).toFixed(1)}M`;
  if (Math.abs(rounded) >= 1000) return `$${(rounded / 1000).toFixed(1)}K`;
  return `$${rounded.toLocaleString('en-US')}`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.green,
  },
  content: {
    paddingHorizontal: 20,
  },
  inlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAction: {
    width: 62,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  headerRightActions: {
    minWidth: 174,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  wordmark: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    includeFontPadding: false,
  },
  hero: {
    paddingTop: 34,
    paddingBottom: 22,
  },
  winHero: {
    borderBottomWidth: 3,
    borderBottomColor: colors.positive,
  },
  lossHero: {
    borderBottomWidth: 3,
    borderBottomColor: colors.negative,
  },
  eyebrow: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    letterSpacing: 0,
    marginBottom: 8,
  },
  title: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 42,
    lineHeight: 46,
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  panel: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
  },
  panelMeta: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  panelEyebrow: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    letterSpacing: 0,
  },
  panelEyebrowOnDark: {
    color: '#EDE4C6',
  },
  nameInput: {
    minHeight: 54,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginTop: 12,
    color: colors.black,
    backgroundColor: '#FFF8E1',
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  archetypeGrid: {
    gap: 14,
    marginBottom: 18,
  },
  archetypeCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    padding: 16,
    overflow: 'hidden',
  },
  archetypeCardSelected: {
    borderColor: colors.black,
    backgroundColor: '#FFF8E1',
  },
  archetypeStripe: {
    height: 5,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  cardTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 26,
    marginTop: 2,
  },
  cardBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  cardFinePrint: {
    color: colors.positive,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 10,
  },
  cardWarning: {
    color: colors.negative,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  smallStatRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  smallStat: {
    flex: 1,
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FFFDF4',
    justifyContent: 'center',
  },
  smallStatLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 13,
  },
  smallStatValue: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 17,
  },
  scenePanel: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sceneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  sceneHeaderCopy: {
    flex: 1,
  },
  sceneTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 27,
  },
  sceneSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  businessCanvas: {
    minHeight: 230,
    backgroundColor: '#EEF4E7',
    borderWidth: 2,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 14,
  },
  canvasSkyline: {
    flex: 1,
    minHeight: 154,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricBillboard: {
    width: 112,
    minHeight: 112,
    backgroundColor: colors.black,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
  },
  billboardLabel: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  billboardValue: {
    color: colors.white,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    marginTop: 4,
  },
  billboardBody: {
    color: '#EDE4C6',
    fontSize: 12,
    marginTop: 2,
  },
  customerStreet: {
    minHeight: 58,
    marginTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#D8CFB3',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    gap: 6,
  },
  sceneStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  storefront: {
    flex: 1,
    minHeight: 142,
    maxWidth: 210,
    justifyContent: 'flex-end',
  },
  awningRow: {
    height: 30,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.black,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  awningPanel: {
    flex: 1,
    backgroundColor: colors.yellow,
  },
  awningPanelAlt: {
    backgroundColor: '#FFF8E1',
  },
  shopWindowRow: {
    minHeight: 82,
    backgroundColor: '#FFFDF4',
    borderWidth: 2,
    borderColor: colors.black,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 8,
    gap: 8,
  },
  shopWindow: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#AEBEA9',
    backgroundColor: '#DDEAF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopDoor: {
    width: 54,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: '#E7F1DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  windowText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  serviceVan: {
    width: 118,
    height: 38,
    backgroundColor: '#DDEAF4',
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  vanText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  vanWheelRow: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: -7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vanWheel: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.black,
  },
  productShelf: {
    flex: 1,
    maxWidth: 220,
    minHeight: 148,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  packageHero: {
    width: 76,
    height: 122,
    backgroundColor: '#FFF8E1',
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  packageLabel: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  shelfRows: {
    flex: 1,
    gap: 8,
  },
  shelfRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    borderBottomWidth: 3,
    borderBottomColor: colors.black,
  },
  productBox: {
    width: 22,
    height: 28,
    backgroundColor: colors.yellow,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 3,
  },
  officeTower: {
    width: 156,
    minHeight: 150,
    backgroundColor: '#DDEAF4',
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-between',
  },
  officeSign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  officeSignText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  officeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 8,
  },
  officeWindow: {
    width: 35,
    height: 22,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: '#FFFDF4',
  },
  officeWindowLit: {
    backgroundColor: colors.yellow,
  },
  dashboardBars: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginTop: 8,
  },
  dashboardBar: {
    width: 18,
    backgroundColor: colors.positive,
    borderRadius: 5,
  },
  customerAvatarWrap: {
    alignItems: 'center',
    width: 52,
    paddingTop: 10,
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInitials: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  customerLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 12,
    marginTop: 3,
  },
  brandStudio: {
    backgroundColor: '#FFF8E1',
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  brandPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  brandControls: {
    flex: 1,
  },
  controlLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    marginBottom: 8,
  },
  wordmarkInput: {
    minHeight: 52,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  logoOption: {
    minHeight: 42,
    minWidth: 76,
    borderWidth: 2,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  logoOptionActive: {
    borderColor: colors.black,
    backgroundColor: '#EEF4E7',
  },
  logoOptionText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  paletteOption: {
    minHeight: 48,
    minWidth: 104,
    borderWidth: 2,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  paletteSwatch: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.black,
  },
  paletteText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  logoMark: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoInnerShape: {
    position: 'absolute',
    width: '58%',
    height: '58%',
    borderRadius: 999,
    opacity: 0.82,
  },
  logoWordmark: {
    fontFamily: 'PlayfairDisplay_700Bold',
    includeFontPadding: false,
  },
  hudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    width: '48.5%',
    minHeight: 76,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  metricCardAlert: {
    borderColor: colors.negative,
    backgroundColor: '#FFF2EC',
  },
  metricLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  metricValue: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 25,
    marginTop: 2,
  },
  stagePanel: {
    backgroundColor: '#EEF4E7',
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  stageLabel: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
  },
  stageBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#D8CFB3',
    borderRadius: 8,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.yellow,
    borderRadius: 8,
  },
  darkPanel: {
    backgroundColor: colors.black,
    borderRadius: 8,
    padding: 18,
    marginBottom: 16,
  },
  darkTitle: {
    color: colors.white,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 27,
    marginTop: 4,
  },
  darkBody: {
    color: '#EDE4C6',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  darkLesson: {
    color: colors.yellow,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    fontWeight: '700',
  },
  reviewPanel: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  reviewScoreRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reviewCard: {
    borderWidth: 2,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    backgroundColor: '#FFFDF4',
    padding: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  reviewCardResolved: {
    backgroundColor: '#EEF4E7',
  },
  reviewMoodStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  reviewName: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
  },
  reviewMeta: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    marginTop: 2,
  },
  reviewStars: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  reviewComment: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 9,
  },
  fixReviewButton: {
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  fixReviewButtonDone: {
    backgroundColor: '#DDEAD4',
  },
  fixReviewButtonText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  actionGrid: {
    gap: 10,
  },
  actionCard: {
    borderWidth: 2,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#FFFDF4',
  },
  actionCardSelected: {
    borderColor: colors.black,
    backgroundColor: '#FFF8E1',
  },
  actionAccent: {
    width: 42,
    height: 5,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
  },
  actionBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  actionCost: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    marginTop: 8,
  },
  cardDisabled: {
    opacity: 0.48,
  },
  fundingGrid: {
    gap: 10,
  },
  fundingCard: {
    borderWidth: 2,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#FFFDF4',
  },
  fundingCardSelected: {
    borderColor: colors.black,
    backgroundColor: '#FFF8E1',
  },
  fundingDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginBottom: 8,
  },
  fundingTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
  },
  fundingBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  fundingTradeoff: {
    color: colors.negative,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  capitalPanel: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  primaryButton: {
    minHeight: 58,
    backgroundColor: colors.yellow,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
  },
  secondaryButton: {
    minHeight: 54,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 14,
  },
  secondaryButtonText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  ledgerPanel: {
    backgroundColor: '#FFF8E1',
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  ledgerTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    marginTop: 4,
  },
  ledgerBody: {
    color: colors.black,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  ledgerWhy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
    marginBottom: 4,
  },
  resultBox: {
    width: '48.5%',
    minHeight: 74,
    borderWidth: 2,
    borderColor: '#D8CFB3',
    borderRadius: 8,
    padding: 11,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  resultLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  resultValue: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 23,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 42,
    borderBottomWidth: 1,
    borderBottomColor: '#E7DDC5',
  },
  milestoneCheck: {
    width: 34,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8CFB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneCheckDone: {
    backgroundColor: colors.positive,
    borderColor: colors.positive,
  },
  milestoneCheckText: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 13,
  },
  milestoneCheckTextDone: {
    color: colors.white,
  },
  milestoneTitle: {
    flex: 1,
    color: colors.black,
    fontSize: 15,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: '#E7DDC5',
  },
  historyMonth: {
    width: 34,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  historyCopy: {
    flex: 1,
  },
  historyTitle: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 14,
  },
  historyBody: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  historyProfit: {
    width: 64,
    textAlign: 'right',
    color: colors.positive,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  historyProfitNegative: {
    color: colors.negative,
  },
  resultActions: {
    gap: 10,
    marginTop: 16,
  },
});
