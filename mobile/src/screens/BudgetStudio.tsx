import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { budgetStorageKey } from '../services/budgetStorage';
import { appColors as colors } from '../theme';
import type { OnboardingProfile } from '../types/onboarding';

type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
type RiskMode = 'guarded' | 'balanced' | 'growth';
type BudgetView = 'overview' | 'plan' | 'cashflow' | 'invest' | 'goals' | 'review';
type TransactionType = 'income' | 'expense' | 'goal' | 'investment' | 'transfer';

type CategoryTemplate = {
  id: string;
  label: string;
  role: 'Essential' | 'Flexible' | 'Future';
  defaultPercent: number;
  color: string;
};

type BudgetCategory = CategoryTemplate & {
  limit: number;
};

type SetupDraft = {
  monthlyIncome: string;
  checkingBalance: string;
  savingsBalance: string;
  cashBalance: string;
  debtBalance: string;
  debtMinimums: string;
  emergencyMonths: string;
  priority: string;
  payFrequency: PayFrequency;
  riskMode: RiskMode;
  firstGoalName: string;
  firstGoalTarget: string;
  firstGoalSaved: string;
  firstGoalMonthly: string;
  startingPortfolio: string;
  monthlyInvesting: string;
};

type CategoryDraft = {
  id: string;
  value: string;
};

type BudgetTransaction = {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId?: string;
  note: string;
  date: string;
};

type Holding = {
  id: string;
  ticker: string;
  name: string;
  assetClass: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  monthlyContribution: number;
  targetWeight: number;
};

type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  dueMonth: string;
  monthlyContribution: number;
  priority: 'High' | 'Medium' | 'Low';
};

type BudgetState = {
  monthlyIncome: number;
  payFrequency: PayFrequency;
  riskMode: RiskMode;
  priority: string;
  checkingBalance: number;
  savingsBalance: number;
  cashBalance: number;
  debtBalance: number;
  debtMinimums: number;
  emergencyMonths: number;
  categories: BudgetCategory[];
  transactions: BudgetTransaction[];
  holdings: Holding[];
  goals: Goal[];
};

type BudgetSessionSnapshot = {
  setupStep: number;
  setupComplete: boolean;
  draft: SetupDraft;
  categoryDrafts: CategoryDraft[];
  budget: BudgetState | null;
  activeView: BudgetView;
};

type ActionDraft = {
  amount: string;
  categoryId: string;
  note: string;
};

type HoldingDraft = {
  ticker: string;
  name: string;
  assetClass: string;
  shares: string;
  avgCost: string;
  currentPrice: string;
  monthlyContribution: string;
  targetWeight: string;
};

type GoalDraft = {
  name: string;
  target: string;
  saved: string;
  monthlyContribution: string;
  dueMonth: string;
  priority: Goal['priority'];
};

const categoryTemplates: CategoryTemplate[] = [
  { id: 'housing', label: 'Housing', role: 'Essential', defaultPercent: 0.25, color: '#2563EB' },
  { id: 'food', label: 'Food', role: 'Essential', defaultPercent: 0.11, color: '#16A34A' },
  { id: 'transport', label: 'Transport', role: 'Essential', defaultPercent: 0.07, color: '#0891B2' },
  { id: 'utilities', label: 'Utilities', role: 'Essential', defaultPercent: 0.07, color: '#7C3AED' },
  { id: 'health', label: 'Health', role: 'Essential', defaultPercent: 0.05, color: '#059669' },
  { id: 'debt', label: 'Debt Extra', role: 'Future', defaultPercent: 0.03, color: '#DC2626' },
  { id: 'fun', label: 'Fun', role: 'Flexible', defaultPercent: 0.07, color: '#DB2777' },
  { id: 'shopping', label: 'Shopping', role: 'Flexible', defaultPercent: 0.04, color: '#EA580C' },
  { id: 'subscriptions', label: 'Subscriptions', role: 'Flexible', defaultPercent: 0.02, color: '#9333EA' },
  { id: 'buffer', label: 'Buffer', role: 'Future', defaultPercent: 0.04, color: '#475569' },
];

const budgetViews: Array<{ id: BudgetView; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'plan', label: 'Plan' },
  { id: 'cashflow', label: 'Cashflow' },
  { id: 'invest', label: 'Invest' },
  { id: 'goals', label: 'Goals' },
  { id: 'review', label: 'Review' },
];

const setupSteps = ['Snapshot', 'Plan', 'Future', 'Stress'];

const payLabels: Record<PayFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  semimonthly: 'Twice monthly',
  monthly: 'Monthly',
};

const riskLabels: Record<RiskMode, string> = {
  guarded: 'Guarded',
  balanced: 'Balanced',
  growth: 'Growth',
};

const goalPriorities: Goal['priority'][] = ['High', 'Medium', 'Low'];

function firstAnswer(profile: OnboardingProfile, key: string, fallback: string) {
  return profile.answers[key]?.[0] ?? fallback;
}

function createInitialDraft(profile: OnboardingProfile): SetupDraft {
  const savingHabit = firstAnswer(profile, 'savingHabit', 'Just starting');
  const riskAnswer = firstAnswer(profile, 'risk', 'Balanced');
  const focus = firstAnswer(profile, 'budgetFocus', 'Saving target');

  return {
    monthlyIncome: savingHabit === 'Consistent' ? '5200' : savingHabit === 'Sometimes' ? '3800' : '2600',
    checkingBalance: '1200',
    savingsBalance: savingHabit === 'Consistent' ? '3500' : '850',
    cashBalance: '120',
    debtBalance: '0',
    debtMinimums: '0',
    emergencyMonths: '3',
    priority: focus,
    payFrequency: 'biweekly',
    riskMode: riskAnswer === 'High risk' ? 'growth' : riskAnswer === 'Conservative' ? 'guarded' : 'balanced',
    firstGoalName: focus === 'Debt payoff' ? 'Debt payoff sprint' : 'Emergency fund',
    firstGoalTarget: savingHabit === 'Consistent' ? '12000' : '6000',
    firstGoalSaved: savingHabit === 'Consistent' ? '3500' : '850',
    firstGoalMonthly: savingHabit === 'Consistent' ? '500' : '200',
    startingPortfolio: savingHabit === 'Consistent' ? '2500' : '0',
    monthlyInvesting: savingHabit === 'Consistent' ? '350' : '100',
  };
}

function parseMoney(value: string | number | undefined) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function createCategoryDrafts(monthlyIncome: number): CategoryDraft[] {
  return categoryTemplates.map((category) => ({
    id: category.id,
    value: String(Math.round(monthlyIncome * category.defaultPercent)),
  }));
}

function createCategories(drafts: CategoryDraft[]): BudgetCategory[] {
  return categoryTemplates.map((category) => ({
    ...category,
    limit: parseMoney(drafts.find((draft) => draft.id === category.id)?.value),
  }));
}

function formatCurrency(value: number) {
  const absValue = Math.abs(value);
  const formatted = absValue.toLocaleString(undefined, {
    maximumFractionDigits: absValue >= 1000 ? 0 : 2,
  });
  return `${value < 0 ? '-' : ''}$${formatted}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(1)}%`;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function buildBudgetFromDraft(draft: SetupDraft, categoryDrafts: CategoryDraft[]): BudgetState {
  const monthlyIncome = parseMoney(draft.monthlyIncome);
  const startingPortfolio = parseMoney(draft.startingPortfolio);
  const monthlyInvesting = parseMoney(draft.monthlyInvesting);
  const firstGoalTarget = parseMoney(draft.firstGoalTarget);
  const firstGoalSaved = parseMoney(draft.firstGoalSaved);
  const firstGoalMonthly = parseMoney(draft.firstGoalMonthly);

  return {
    monthlyIncome,
    payFrequency: draft.payFrequency,
    riskMode: draft.riskMode,
    priority: draft.priority.trim() || 'Build stability',
    checkingBalance: parseMoney(draft.checkingBalance),
    savingsBalance: parseMoney(draft.savingsBalance),
    cashBalance: parseMoney(draft.cashBalance),
    debtBalance: parseMoney(draft.debtBalance),
    debtMinimums: parseMoney(draft.debtMinimums),
    emergencyMonths: Math.max(1, parseMoney(draft.emergencyMonths)),
    categories: createCategories(categoryDrafts),
    transactions: [],
    holdings: startingPortfolio > 0 ? [{
      id: makeId('holding'),
      ticker: 'CORE',
      name: 'Starting portfolio',
      assetClass: 'Mixed',
      shares: 1,
      avgCost: startingPortfolio,
      currentPrice: startingPortfolio,
      monthlyContribution: monthlyInvesting,
      targetWeight: draft.riskMode === 'growth' ? 75 : draft.riskMode === 'guarded' ? 45 : 60,
    }] : [],
    goals: firstGoalTarget > 0 ? [{
      id: makeId('goal'),
      name: draft.firstGoalName.trim() || 'Emergency fund',
      target: firstGoalTarget,
      saved: Math.min(firstGoalSaved, firstGoalTarget),
      dueMonth: '2026-12',
      monthlyContribution: firstGoalMonthly,
      priority: 'High',
    }] : [],
  };
}

function getBudgetMetrics(budget: BudgetState) {
  const currentMonth = getCurrentMonthKey();
  const monthTransactions = budget.transactions.filter((tx) => monthKey(tx.date) === currentMonth);
  const categorySpend = budget.categories.reduce<Record<string, number>>((result, category) => {
    result[category.id] = 0;
    return result;
  }, {});

  monthTransactions.forEach((tx) => {
    if (tx.type === 'expense' && tx.categoryId) {
      categorySpend[tx.categoryId] = roundCurrency((categorySpend[tx.categoryId] ?? 0) + tx.amount);
    }
  });

  const totalSpent = Object.values(categorySpend).reduce((sum, amount) => sum + amount, 0);
  const extraIncome = monthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const goalContributions = budget.goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const investmentContributions = budget.holdings.reduce((sum, holding) => sum + holding.monthlyContribution, 0);
  const assignedToCategories = budget.categories.reduce((sum, category) => sum + category.limit, 0);
  const assigned = assignedToCategories + goalContributions + investmentContributions + budget.debtMinimums;
  const plannedSurplus = budget.monthlyIncome - assigned;
  const availableCash = budget.checkingBalance + budget.savingsBalance + budget.cashBalance;
  const portfolioValue = budget.holdings.reduce((sum, holding) => sum + holding.shares * holding.currentPrice, 0);
  const portfolioCost = budget.holdings.reduce((sum, holding) => sum + holding.shares * holding.avgCost, 0);
  const portfolioPL = portfolioValue - portfolioCost;
  const essentialSpend = budget.categories
    .filter((category) => category.role === 'Essential')
    .reduce((sum, category) => sum + category.limit, 0) + budget.debtMinimums;
  const runwayMonths = essentialSpend > 0 ? availableCash / essentialSpend : 0;
  const savingsRate = budget.monthlyIncome > 0
    ? ((goalContributions + investmentContributions + Math.max(0, plannedSurplus)) / budget.monthlyIncome) * 100
    : 0;
  const netWorth = availableCash + portfolioValue - budget.debtBalance;
  const unassigned = budget.monthlyIncome + extraIncome - assigned;

  return {
    currentMonth,
    monthTransactions,
    categorySpend,
    totalSpent,
    extraIncome,
    goalContributions,
    investmentContributions,
    assignedToCategories,
    assigned,
    plannedSurplus,
    availableCash,
    portfolioValue,
    portfolioCost,
    portfolioPL,
    essentialSpend,
    runwayMonths,
    savingsRate,
    netWorth,
    unassigned,
  };
}

export default function BudgetStudio({ profile }: { profile: OnboardingProfile }) {
  const [setupStep, setSetupStep] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);
  const [draft, setDraft] = useState<SetupDraft>(() => createInitialDraft(profile));
  const [categoryDrafts, setCategoryDrafts] = useState<CategoryDraft[]>(() => (
    createCategoryDrafts(parseMoney(createInitialDraft(profile).monthlyIncome))
  ));
  const [budget, setBudget] = useState<BudgetState | null>(null);
  const [activeView, setActiveView] = useState<BudgetView>('overview');
  const [isHydrated, setIsHydrated] = useState(false);

  const previewBudget = useMemo(
    () => buildBudgetFromDraft(draft, categoryDrafts),
    [categoryDrafts, draft],
  );
  const activeBudget = budget ?? previewBudget;
  const metrics = useMemo(() => getBudgetMetrics(activeBudget), [activeBudget]);

  const updateDraft = <K extends keyof SetupDraft>(key: K, value: SetupDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const regeneratePlan = () => {
    setCategoryDrafts(createCategoryDrafts(parseMoney(draft.monthlyIncome)));
  };

  const finishSetup = () => {
    setBudget(buildBudgetFromDraft(draft, categoryDrafts));
    setSetupComplete(true);
  };

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(budgetStorageKey)
      .then((raw) => {
        if (!isMounted || !raw) return;
        const saved = JSON.parse(raw) as Partial<BudgetSessionSnapshot>;
        const defaultDraft = createInitialDraft(profile);

        if (typeof saved.setupStep === 'number') {
          setSetupStep(Math.min(setupSteps.length - 1, Math.max(0, saved.setupStep)));
        }
        if (typeof saved.setupComplete === 'boolean') setSetupComplete(saved.setupComplete);
        if (saved.draft) setDraft({ ...defaultDraft, ...saved.draft });
        if (Array.isArray(saved.categoryDrafts) && saved.categoryDrafts.length > 0) {
          setCategoryDrafts(saved.categoryDrafts);
        }
        if (saved.budget) setBudget(saved.budget);
        if (saved.activeView && budgetViews.some((view) => view.id === saved.activeView)) {
          setActiveView(saved.activeView);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, [profile]);

  useEffect(() => {
    if (!isHydrated) return;
    const snapshot: BudgetSessionSnapshot = {
      setupStep,
      setupComplete,
      draft,
      categoryDrafts,
      budget,
      activeView,
    };
    void AsyncStorage.setItem(budgetStorageKey, JSON.stringify(snapshot));
  }, [activeView, budget, categoryDrafts, draft, isHydrated, setupComplete, setupStep]);

  if (!isHydrated) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.setupPanel}>
          <Text style={styles.panelEyebrow}>BUDGET</Text>
          <Text style={styles.panelTitle}>Loading saved plan</Text>
        </View>
      </View>
    );
  }

  if (!setupComplete) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.setupHero}>
          <Text style={styles.eyebrow}>BUDGET SETUP</Text>
          <Text style={styles.title}>Build your money operating system</Text>
          <Text style={styles.body}>
            Start with income, cash, debts, categories, goals, and investing rules. Coinly turns it
            into a working monthly plan you can update every day.
          </Text>
        </View>

        <ProgressStepper currentStep={setupStep} />

        {setupStep === 0 ? (
          <SetupSnapshot draft={draft} updateDraft={updateDraft} />
        ) : setupStep === 1 ? (
          <SetupPlan
            draft={draft}
            categoryDrafts={categoryDrafts}
            setCategoryDrafts={setCategoryDrafts}
            regeneratePlan={regeneratePlan}
          />
        ) : setupStep === 2 ? (
          <SetupFuture draft={draft} updateDraft={updateDraft} />
        ) : (
          <SetupStress budget={previewBudget} metrics={metrics} />
        )}

        <View style={styles.setupFooter}>
          <TouchableOpacity
            style={[styles.secondaryButton, setupStep === 0 && styles.disabledButton]}
            disabled={setupStep === 0}
            onPress={() => setSetupStep((step) => Math.max(0, step - 1))}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              if (setupStep < setupSteps.length - 1) {
                setSetupStep((step) => step + 1);
                return;
              }
              finishSetup();
            }}
          >
            <Text style={styles.primaryButtonText}>{setupStep === setupSteps.length - 1 ? 'Launch Budget' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <BudgetWorkspace
      budget={activeBudget}
      metrics={metrics}
      activeView={activeView}
      setActiveView={setActiveView}
      setBudget={setBudget}
      onRebuild={() => {
        setSetupComplete(false);
        setSetupStep(0);
      }}
    />
  );
}

function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <View style={styles.stepper}>
      {setupSteps.map((step, index) => (
        <View key={step} style={styles.stepItem}>
          <View style={[styles.stepDot, index <= currentStep && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, index <= currentStep && styles.stepDotTextActive]}>{index + 1}</Text>
          </View>
          <Text style={[styles.stepLabel, index === currentStep && styles.stepLabelActive]}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

function SetupSnapshot({
  draft,
  updateDraft,
}: {
  draft: SetupDraft;
  updateDraft: <K extends keyof SetupDraft>(key: K, value: SetupDraft[K]) => void;
}) {
  return (
    <View style={styles.setupPanel}>
      <SectionHeader eyebrow="STEP 1" title="Money snapshot" />
      <MoneyField label="Monthly take-home" value={draft.monthlyIncome} onChangeText={(value) => updateDraft('monthlyIncome', value)} />
      <View style={styles.twoColumn}>
        <MoneyField label="Checking" value={draft.checkingBalance} onChangeText={(value) => updateDraft('checkingBalance', value)} />
        <MoneyField label="Cash" value={draft.cashBalance} onChangeText={(value) => updateDraft('cashBalance', value)} />
      </View>
      <View style={styles.twoColumn}>
        <MoneyField label="Savings" value={draft.savingsBalance} onChangeText={(value) => updateDraft('savingsBalance', value)} />
        <MoneyField label="Debt balance" value={draft.debtBalance} onChangeText={(value) => updateDraft('debtBalance', value)} />
      </View>
      <MoneyField label="Monthly debt minimums" value={draft.debtMinimums} onChangeText={(value) => updateDraft('debtMinimums', value)} />
      <OptionRow
        label="Pay rhythm"
        options={Object.entries(payLabels).map(([id, label]) => ({ id, label }))}
        selected={draft.payFrequency}
        onSelect={(value) => updateDraft('payFrequency', value as PayFrequency)}
      />
      <TextInput
        style={styles.textField}
        value={draft.priority}
        onChangeText={(value) => updateDraft('priority', value)}
        placeholder="Top priority"
        placeholderTextColor="rgba(16,36,29,0.42)"
      />
    </View>
  );
}

function SetupPlan({
  draft,
  categoryDrafts,
  setCategoryDrafts,
  regeneratePlan,
}: {
  draft: SetupDraft;
  categoryDrafts: CategoryDraft[];
  setCategoryDrafts: React.Dispatch<React.SetStateAction<CategoryDraft[]>>;
  regeneratePlan: () => void;
}) {
  const assigned = categoryDrafts.reduce((sum, category) => sum + parseMoney(category.value), 0);
  const left = parseMoney(draft.monthlyIncome) - assigned - parseMoney(draft.debtMinimums);

  return (
    <View style={styles.setupPanel}>
      <View style={styles.sectionHeaderRow}>
        <SectionHeader eyebrow="STEP 2" title="Envelope plan" />
        <TouchableOpacity style={styles.smallButton} onPress={regeneratePlan}>
          <Text style={styles.smallButtonText}>Auto</Text>
        </TouchableOpacity>
      </View>
      <MetricStrip
        items={[
          { label: 'Income', value: formatCurrency(parseMoney(draft.monthlyIncome)) },
          { label: 'Assigned', value: formatCurrency(assigned + parseMoney(draft.debtMinimums)) },
          { label: 'Left', value: formatCurrency(left), tone: left >= 0 ? 'good' : 'bad' },
        ]}
      />
      {categoryTemplates.map((category) => {
        const current = categoryDrafts.find((draftCategory) => draftCategory.id === category.id)?.value ?? '0';
        return (
          <BudgetAmountRow
            key={category.id}
            color={category.color}
            label={category.label}
            meta={`${category.role} / ${(category.defaultPercent * 100).toFixed(0)}% guide`}
            value={current}
            onChangeText={(value) => {
              setCategoryDrafts((existing) => existing.map((draftCategory) => (
                draftCategory.id === category.id ? { ...draftCategory, value } : draftCategory
              )));
            }}
          />
        );
      })}
    </View>
  );
}

function SetupFuture({
  draft,
  updateDraft,
}: {
  draft: SetupDraft;
  updateDraft: <K extends keyof SetupDraft>(key: K, value: SetupDraft[K]) => void;
}) {
  return (
    <View style={styles.setupPanel}>
      <SectionHeader eyebrow="STEP 3" title="Goals and investing" />
      <OptionRow
        label="Risk mode"
        options={Object.entries(riskLabels).map(([id, label]) => ({ id, label }))}
        selected={draft.riskMode}
        onSelect={(value) => updateDraft('riskMode', value as RiskMode)}
      />
      <MoneyField label="Emergency target months" value={draft.emergencyMonths} prefix="" onChangeText={(value) => updateDraft('emergencyMonths', value)} />
      <TextInput
        style={styles.textField}
        value={draft.firstGoalName}
        onChangeText={(value) => updateDraft('firstGoalName', value)}
        placeholder="First goal name"
        placeholderTextColor="rgba(16,36,29,0.42)"
      />
      <View style={styles.twoColumn}>
        <MoneyField label="Goal target" value={draft.firstGoalTarget} onChangeText={(value) => updateDraft('firstGoalTarget', value)} />
        <MoneyField label="Saved now" value={draft.firstGoalSaved} onChangeText={(value) => updateDraft('firstGoalSaved', value)} />
      </View>
      <View style={styles.twoColumn}>
        <MoneyField label="Monthly goal" value={draft.firstGoalMonthly} onChangeText={(value) => updateDraft('firstGoalMonthly', value)} />
        <MoneyField label="Monthly invest" value={draft.monthlyInvesting} onChangeText={(value) => updateDraft('monthlyInvesting', value)} />
      </View>
      <MoneyField label="Portfolio value today" value={draft.startingPortfolio} onChangeText={(value) => updateDraft('startingPortfolio', value)} />
    </View>
  );
}

function SetupStress({ budget, metrics }: { budget: BudgetState; metrics: ReturnType<typeof getBudgetMetrics> }) {
  const lowerIncome = budget.monthlyIncome * 0.85;
  const shockExpense = metrics.essentialSpend + 600;
  const stressSurplus = lowerIncome - metrics.assigned - 600;
  const targetRunway = budget.emergencyMonths;
  const essentialsCovered = metrics.runwayMonths >= targetRunway;

  return (
    <View style={styles.setupPanel}>
      <SectionHeader eyebrow="STEP 4" title="Stress test" />
      <MetricStrip
        items={[
          { label: 'Net worth', value: formatCurrency(metrics.netWorth) },
          { label: 'Runway', value: `${metrics.runwayMonths.toFixed(1)} mo`, tone: essentialsCovered ? 'good' : 'warn' },
          { label: 'Surplus', value: formatCurrency(metrics.plannedSurplus), tone: metrics.plannedSurplus >= 0 ? 'good' : 'bad' },
        ]}
      />
      <View style={styles.scenarioPanel}>
        <Text style={styles.scenarioTitle}>Income down 15% plus a $600 surprise</Text>
        <Text style={styles.scenarioValue}>{formatCurrency(stressSurplus)}</Text>
        <Text style={styles.scenarioBody}>
          {stressSurplus >= 0
            ? 'The plan survives a rough month. Keep the buffer funded and automate the future categories.'
            : 'The plan is tight under stress. Lower flexible categories or push part of the goal contribution later.'}
        </Text>
      </View>
      <View style={styles.ruleGrid}>
        <RuleCard label="Income after cut" value={formatCurrency(lowerIncome)} />
        <RuleCard label="Essential burn" value={formatCurrency(shockExpense)} />
        <RuleCard label="Target reserve" value={`${targetRunway.toFixed(0)} months`} />
      </View>
    </View>
  );
}

function BudgetWorkspace({
  budget,
  metrics,
  activeView,
  setActiveView,
  setBudget,
  onRebuild,
}: {
  budget: BudgetState;
  metrics: ReturnType<typeof getBudgetMetrics>;
  activeView: BudgetView;
  setActiveView: React.Dispatch<React.SetStateAction<BudgetView>>;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
  onRebuild: () => void;
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.commandCenter}>
        <View style={styles.commandTop}>
          <View>
            <Text style={styles.eyebrow}>BUDGET COMMAND</Text>
            <Text style={styles.commandTitle}>Every dollar has a job</Text>
          </View>
          <TouchableOpacity style={styles.rebuildButton} onPress={onRebuild}>
            <Text style={styles.rebuildButtonText}>Setup</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.commandBody}>
          Priority: {budget.priority}. Pay rhythm: {payLabels[budget.payFrequency]}. Risk mode: {riskLabels[budget.riskMode]}.
        </Text>
        <View style={styles.heroMetrics}>
          <MetricTile label="Net Worth" value={formatCurrency(metrics.netWorth)} />
          <MetricTile label="Cash" value={formatCurrency(metrics.availableCash)} />
          <MetricTile label="Surplus" value={formatCurrency(metrics.plannedSurplus)} tone={metrics.plannedSurplus >= 0 ? 'good' : 'bad'} />
          <MetricTile label="Save Rate" value={formatPercent(metrics.savingsRate)} tone={metrics.savingsRate >= 20 ? 'good' : 'warn'} />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.viewTabs}
        contentContainerStyle={styles.viewTabsContent}
      >
        {budgetViews.map((view) => {
          const isActive = activeView === view.id;
          return (
            <TouchableOpacity
              key={view.id}
              style={[styles.viewTab, isActive && styles.viewTabActive]}
              onPress={() => setActiveView(view.id)}
            >
              <Text style={[styles.viewTabText, isActive && styles.viewTabTextActive]}>{view.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {activeView === 'overview' ? (
        <OverviewView budget={budget} metrics={metrics} setBudget={setBudget} setActiveView={setActiveView} />
      ) : activeView === 'plan' ? (
        <PlanView budget={budget} metrics={metrics} setBudget={setBudget} />
      ) : activeView === 'cashflow' ? (
        <CashflowView budget={budget} metrics={metrics} setBudget={setBudget} />
      ) : activeView === 'invest' ? (
        <InvestView budget={budget} metrics={metrics} setBudget={setBudget} />
      ) : activeView === 'goals' ? (
        <GoalsView budget={budget} setBudget={setBudget} />
      ) : (
        <ReviewView budget={budget} metrics={metrics} />
      )}
    </View>
  );
}

function OverviewView({
  budget,
  metrics,
  setBudget,
  setActiveView,
}: {
  budget: BudgetState;
  metrics: ReturnType<typeof getBudgetMetrics>;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
  setActiveView: React.Dispatch<React.SetStateAction<BudgetView>>;
}) {
  const overBudgetCount = budget.categories.filter((category) => (
    (metrics.categorySpend[category.id] ?? 0) > category.limit
  )).length;
  const topCategories = [...budget.categories]
    .sort((a, b) => (metrics.categorySpend[b.id] ?? 0) - (metrics.categorySpend[a.id] ?? 0))
    .slice(0, 5);

  return (
    <View>
      <View style={styles.panel}>
        <SectionHeader eyebrow="MONTHLY OPERATING PLAN" title="Current month" />
        <MetricStrip
          items={[
            { label: 'Income', value: formatCurrency(budget.monthlyIncome + metrics.extraIncome) },
            { label: 'Assigned', value: formatCurrency(metrics.assigned) },
            { label: 'Spent', value: formatCurrency(metrics.totalSpent) },
          ]}
        />
        <View style={styles.healthRow}>
          <RuleCard label="Runway" value={`${metrics.runwayMonths.toFixed(1)} months`} />
          <RuleCard label="Over budget" value={String(overBudgetCount)} />
          <RuleCard label="Investing" value={formatCurrency(metrics.investmentContributions)} />
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.sectionHeaderRow}>
          <SectionHeader eyebrow="ENVELOPES" title="Spending control" />
          <TouchableOpacity style={styles.smallButton} onPress={() => setActiveView('plan')}>
            <Text style={styles.smallButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {topCategories.map((category) => (
          <EnvelopeRow
            key={category.id}
            category={category}
            spent={metrics.categorySpend[category.id] ?? 0}
          />
        ))}
      </View>

      <QuickMoneyPanel budget={budget} setBudget={setBudget} />
    </View>
  );
}

function PlanView({
  budget,
  metrics,
  setBudget,
}: {
  budget: BudgetState;
  metrics: ReturnType<typeof getBudgetMetrics>;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
}) {
  return (
    <View>
      <View style={styles.panel}>
        <SectionHeader eyebrow="ZERO-BASED PLAN" title="Assign income before it disappears" />
        <MetricStrip
          items={[
            { label: 'Categories', value: formatCurrency(metrics.assignedToCategories) },
            { label: 'Future', value: formatCurrency(metrics.goalContributions + metrics.investmentContributions) },
            { label: 'Unassigned', value: formatCurrency(metrics.unassigned), tone: metrics.unassigned >= 0 ? 'good' : 'bad' },
          ]}
        />
        {budget.categories.map((category) => (
          <BudgetAmountRow
            key={category.id}
            color={category.color}
            label={category.label}
            meta={`${category.role} / spent ${formatCurrency(metrics.categorySpend[category.id] ?? 0)}`}
            value={String(category.limit)}
            onChangeText={(value) => {
              const amount = parseMoney(value);
              setBudget((current) => current ? {
                ...current,
                categories: current.categories.map((existing) => (
                  existing.id === category.id ? { ...existing, limit: amount } : existing
                )),
              } : current);
            }}
          />
        ))}
      </View>
    </View>
  );
}

function CashflowView({
  budget,
  metrics,
  setBudget,
}: {
  budget: BudgetState;
  metrics: ReturnType<typeof getBudgetMetrics>;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
}) {
  const recentTransactions = [...budget.transactions].slice(0, 12);

  return (
    <View>
      <QuickMoneyPanel budget={budget} setBudget={setBudget} />

      <View style={styles.panel}>
        <SectionHeader eyebrow="LEDGER" title="This month" />
        <MetricStrip
          items={[
            { label: 'Expenses', value: formatCurrency(metrics.totalSpent), tone: 'warn' },
            { label: 'Extra income', value: formatCurrency(metrics.extraIncome), tone: 'good' },
            { label: 'Cash now', value: formatCurrency(metrics.availableCash) },
          ]}
        />
        {recentTransactions.length === 0 ? (
          <EmptyState title="No money movement yet" body="Add income, expenses, goal moves, or investments to start tracking the month." />
        ) : recentTransactions.map((transaction) => (
          <LedgerRow key={transaction.id} transaction={transaction} budget={budget} />
        ))}
      </View>
    </View>
  );
}

function InvestView({
  budget,
  metrics,
  setBudget,
}: {
  budget: BudgetState;
  metrics: ReturnType<typeof getBudgetMetrics>;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
}) {
  const [draft, setDraft] = useState<HoldingDraft>({
    ticker: '',
    name: '',
    assetClass: 'ETF',
    shares: '',
    avgCost: '',
    currentPrice: '',
    monthlyContribution: '',
    targetWeight: '',
  });

  const addHolding = () => {
    const ticker = draft.ticker.trim().toUpperCase();
    const shares = parseMoney(draft.shares);
    const currentPrice = parseMoney(draft.currentPrice || draft.avgCost);
    const avgCost = parseMoney(draft.avgCost || draft.currentPrice);
    if (!ticker || shares <= 0 || currentPrice <= 0) return;

    const holding: Holding = {
      id: makeId('holding'),
      ticker,
      name: draft.name.trim() || ticker,
      assetClass: draft.assetClass.trim() || 'Investment',
      shares,
      avgCost,
      currentPrice,
      monthlyContribution: parseMoney(draft.monthlyContribution),
      targetWeight: parseMoney(draft.targetWeight),
    };

    setBudget((current) => current ? {
      ...current,
      holdings: [holding, ...current.holdings],
    } : current);
    setDraft({
      ticker: '',
      name: '',
      assetClass: 'ETF',
      shares: '',
      avgCost: '',
      currentPrice: '',
      monthlyContribution: '',
      targetWeight: '',
    });
  };

  return (
    <View>
      <View style={styles.panel}>
        <SectionHeader eyebrow="PORTFOLIO" title="Investment tracker" />
        <MetricStrip
          items={[
            { label: 'Value', value: formatCurrency(metrics.portfolioValue) },
            { label: 'P/L', value: formatCurrency(metrics.portfolioPL), tone: metrics.portfolioPL >= 0 ? 'good' : 'bad' },
            { label: 'Monthly', value: formatCurrency(metrics.investmentContributions) },
          ]}
        />
        {budget.holdings.length === 0 ? (
          <EmptyState title="No investments yet" body="Add holdings to track value, contribution rules, and allocation drift." />
        ) : budget.holdings.map((holding) => (
          <HoldingRow key={holding.id} holding={holding} portfolioValue={metrics.portfolioValue} />
        ))}
      </View>

      <View style={styles.panel}>
        <SectionHeader eyebrow="ADD HOLDING" title="Track a position" />
        <View style={styles.twoColumn}>
          <TextInput
            style={styles.textField}
            value={draft.ticker}
            onChangeText={(value) => setDraft((current) => ({ ...current, ticker: value }))}
            placeholder="Ticker"
            placeholderTextColor="rgba(16,36,29,0.42)"
            autoCapitalize="characters"
          />
          <TextInput
            style={styles.textField}
            value={draft.assetClass}
            onChangeText={(value) => setDraft((current) => ({ ...current, assetClass: value }))}
            placeholder="Asset class"
            placeholderTextColor="rgba(16,36,29,0.42)"
          />
        </View>
        <TextInput
          style={styles.textField}
          value={draft.name}
          onChangeText={(value) => setDraft((current) => ({ ...current, name: value }))}
          placeholder="Name"
          placeholderTextColor="rgba(16,36,29,0.42)"
        />
        <View style={styles.twoColumn}>
          <MoneyField label="Shares" value={draft.shares} prefix="" onChangeText={(value) => setDraft((current) => ({ ...current, shares: value }))} />
          <MoneyField label="Current price" value={draft.currentPrice} onChangeText={(value) => setDraft((current) => ({ ...current, currentPrice: value }))} />
        </View>
        <View style={styles.twoColumn}>
          <MoneyField label="Avg cost" value={draft.avgCost} onChangeText={(value) => setDraft((current) => ({ ...current, avgCost: value }))} />
          <MoneyField label="Target %" value={draft.targetWeight} prefix="" onChangeText={(value) => setDraft((current) => ({ ...current, targetWeight: value }))} />
        </View>
        <MoneyField label="Monthly contribution" value={draft.monthlyContribution} onChangeText={(value) => setDraft((current) => ({ ...current, monthlyContribution: value }))} />
        <TouchableOpacity style={styles.primaryButton} onPress={addHolding}>
          <Text style={styles.primaryButtonText}>Add Holding</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function GoalsView({
  budget,
  setBudget,
}: {
  budget: BudgetState;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
}) {
  const [draft, setDraft] = useState<GoalDraft>({
    name: '',
    target: '',
    saved: '',
    monthlyContribution: '',
    dueMonth: '2026-12',
    priority: 'Medium',
  });

  const addGoal = () => {
    const target = parseMoney(draft.target);
    if (!draft.name.trim() || target <= 0) return;
    const goal: Goal = {
      id: makeId('goal'),
      name: draft.name.trim(),
      target,
      saved: Math.min(parseMoney(draft.saved), target),
      monthlyContribution: parseMoney(draft.monthlyContribution),
      dueMonth: draft.dueMonth || '2026-12',
      priority: draft.priority,
    };

    setBudget((current) => current ? {
      ...current,
      goals: [goal, ...current.goals],
    } : current);
    setDraft({
      name: '',
      target: '',
      saved: '',
      monthlyContribution: '',
      dueMonth: '2026-12',
      priority: 'Medium',
    });
  };

  const totalSaved = budget.goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = budget.goals.reduce((sum, goal) => sum + goal.target, 0);

  return (
    <View>
      <View style={styles.panel}>
        <SectionHeader eyebrow="GOALS" title="Fund the future" />
        <MetricStrip
          items={[
            { label: 'Saved', value: formatCurrency(totalSaved), tone: 'good' },
            { label: 'Target', value: formatCurrency(totalTarget) },
            { label: 'Progress', value: formatPercent(totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0) },
          ]}
        />
        {budget.goals.length === 0 ? (
          <EmptyState title="No goals yet" body="Create goals for emergency reserves, trips, payoff targets, or major purchases." />
        ) : budget.goals.map((goal) => (
          <GoalRow key={goal.id} goal={goal} setBudget={setBudget} />
        ))}
      </View>

      <View style={styles.panel}>
        <SectionHeader eyebrow="ADD GOAL" title="Create a funding target" />
        <TextInput
          style={styles.textField}
          value={draft.name}
          onChangeText={(value) => setDraft((current) => ({ ...current, name: value }))}
          placeholder="Goal name"
          placeholderTextColor="rgba(16,36,29,0.42)"
        />
        <View style={styles.twoColumn}>
          <MoneyField label="Target" value={draft.target} onChangeText={(value) => setDraft((current) => ({ ...current, target: value }))} />
          <MoneyField label="Saved" value={draft.saved} onChangeText={(value) => setDraft((current) => ({ ...current, saved: value }))} />
        </View>
        <View style={styles.twoColumn}>
          <MoneyField label="Monthly" value={draft.monthlyContribution} onChangeText={(value) => setDraft((current) => ({ ...current, monthlyContribution: value }))} />
          <TextInput
            style={styles.textField}
            value={draft.dueMonth}
            onChangeText={(value) => setDraft((current) => ({ ...current, dueMonth: value }))}
            placeholder="YYYY-MM"
            placeholderTextColor="rgba(16,36,29,0.42)"
          />
        </View>
        <OptionRow
          label="Priority"
          options={goalPriorities.map((priority) => ({ id: priority, label: priority }))}
          selected={draft.priority}
          onSelect={(value) => setDraft((current) => ({ ...current, priority: value as Goal['priority'] }))}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={addGoal}>
          <Text style={styles.primaryButtonText}>Add Goal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ReviewView({ budget, metrics }: { budget: BudgetState; metrics: ReturnType<typeof getBudgetMetrics> }) {
  const overBudget = budget.categories.filter((category) => (
    (metrics.categorySpend[category.id] ?? 0) > category.limit
  ));
  const flexibleRoom = budget.categories
    .filter((category) => category.role === 'Flexible')
    .reduce((sum, category) => sum + Math.max(0, category.limit - (metrics.categorySpend[category.id] ?? 0)), 0);
  const emergencyGap = Math.max(0, (metrics.essentialSpend * budget.emergencyMonths) - metrics.availableCash);
  const portfolioDrift = budget.holdings
    .filter((holding) => holding.targetWeight > 0 && metrics.portfolioValue > 0)
    .map((holding) => {
      const actual = ((holding.shares * holding.currentPrice) / metrics.portfolioValue) * 100;
      return { holding, actual, drift: actual - holding.targetWeight };
    })
    .sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift));

  return (
    <View>
      <View style={styles.panel}>
        <SectionHeader eyebrow="REVIEW" title="Budget diagnostics" />
        <MetricStrip
          items={[
            { label: 'Emergency gap', value: formatCurrency(emergencyGap), tone: emergencyGap === 0 ? 'good' : 'warn' },
            { label: 'Flexible room', value: formatCurrency(flexibleRoom), tone: 'good' },
            { label: 'Risk mode', value: riskLabels[budget.riskMode] },
          ]}
        />
        <InsightRow
          title={metrics.plannedSurplus >= 0 ? 'Plan is funded' : 'Plan is over-assigned'}
          body={metrics.plannedSurplus >= 0
            ? `${formatCurrency(metrics.plannedSurplus)} remains after envelopes, goals, investing, and debt minimums.`
            : `Pull ${formatCurrency(Math.abs(metrics.plannedSurplus))} from flexible categories or lower future contributions.`}
          tone={metrics.plannedSurplus >= 0 ? 'good' : 'bad'}
        />
        <InsightRow
          title={emergencyGap === 0 ? 'Reserve target covered' : 'Reserve gap remains'}
          body={emergencyGap === 0
            ? `Cash covers ${metrics.runwayMonths.toFixed(1)} months of essentials.`
            : `Add ${formatCurrency(emergencyGap)} to reach ${budget.emergencyMonths.toFixed(0)} months of essentials.`}
          tone={emergencyGap === 0 ? 'good' : 'warn'}
        />
        <InsightRow
          title={overBudget.length === 0 ? 'No category breaks' : `${overBudget.length} category issue${overBudget.length > 1 ? 's' : ''}`}
          body={overBudget.length === 0
            ? 'Every tracked category is inside its monthly envelope.'
            : `Watch ${overBudget.map((category) => category.label).join(', ')} before adding discretionary purchases.`}
          tone={overBudget.length === 0 ? 'good' : 'bad'}
        />
      </View>

      <View style={styles.panel}>
        <SectionHeader eyebrow="ALLOCATION" title="Investment drift" />
        {portfolioDrift.length === 0 ? (
          <EmptyState title="No target drift yet" body="Add target weights to holdings to see rebalancing pressure." />
        ) : portfolioDrift.slice(0, 4).map(({ holding, actual, drift }) => (
          <View key={holding.id} style={styles.driftRow}>
            <View>
              <Text style={styles.rowTitle}>{holding.ticker}</Text>
              <Text style={styles.rowMeta}>Actual {formatPercent(actual)} / target {formatPercent(holding.targetWeight)}</Text>
            </View>
            <Text style={[styles.driftValue, Math.abs(drift) <= 5 ? styles.goodText : styles.warnText]}>
              {drift >= 0 ? '+' : ''}{formatPercent(drift)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function QuickMoneyPanel({
  budget,
  setBudget,
}: {
  budget: BudgetState;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
}) {
  const [type, setType] = useState<TransactionType>('expense');
  const [draft, setDraft] = useState<ActionDraft>({
    amount: '',
    categoryId: budget.categories[0]?.id ?? '',
    note: '',
  });

  const addTransaction = () => {
    const amount = parseMoney(draft.amount);
    if (amount <= 0) return;

    const tx: BudgetTransaction = {
      id: makeId('tx'),
      type,
      amount,
      categoryId: type === 'expense' ? draft.categoryId : undefined,
      note: draft.note.trim() || defaultTransactionNote(type, budget, draft.categoryId),
      date: new Date().toISOString(),
    };

    setBudget((current) => {
      if (!current) return current;

      if (type === 'income') {
        return {
          ...current,
          checkingBalance: roundCurrency(current.checkingBalance + amount),
          transactions: [tx, ...current.transactions],
        };
      }

      if (type === 'transfer') {
        return {
          ...current,
          checkingBalance: roundCurrency(Math.max(0, current.checkingBalance - amount)),
          savingsBalance: roundCurrency(current.savingsBalance + amount),
          transactions: [tx, ...current.transactions],
        };
      }

      if (type === 'goal') {
        const firstGoal = current.goals[0];
        return {
          ...current,
          checkingBalance: roundCurrency(Math.max(0, current.checkingBalance - amount)),
          savingsBalance: roundCurrency(current.savingsBalance + amount),
          goals: firstGoal ? current.goals.map((goal, index) => (
            index === 0 ? { ...goal, saved: Math.min(goal.target, roundCurrency(goal.saved + amount)) } : goal
          )) : current.goals,
          transactions: [tx, ...current.transactions],
        };
      }

      if (type === 'investment') {
        const firstHolding = current.holdings[0];
        return {
          ...current,
          checkingBalance: roundCurrency(Math.max(0, current.checkingBalance - amount)),
          holdings: firstHolding ? current.holdings.map((holding, index) => (
            index === 0
              ? { ...holding, shares: roundCurrency(holding.shares + amount / Math.max(holding.currentPrice, 1)) }
              : holding
          )) : current.holdings,
          transactions: [tx, ...current.transactions],
        };
      }

      return {
        ...current,
        checkingBalance: roundCurrency(Math.max(0, current.checkingBalance - amount)),
        transactions: [tx, ...current.transactions],
      };
    });

    setDraft((current) => ({ ...current, amount: '', note: '' }));
  };

  return (
    <View style={styles.panel}>
      <SectionHeader eyebrow="ADD MONEY MOVEMENT" title="Update the budget" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionTypeRow}>
        {(['expense', 'income', 'transfer', 'goal', 'investment'] as TransactionType[]).map((option) => {
          const isActive = type === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.actionTypeButton, isActive && styles.actionTypeButtonActive]}
              onPress={() => setType(option)}
            >
              <Text style={[styles.actionTypeText, isActive && styles.actionTypeTextActive]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <MoneyField
        label="Amount"
        value={draft.amount}
        onChangeText={(value) => setDraft((current) => ({ ...current, amount: value }))}
      />
      {type === 'expense' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPicker}>
          {budget.categories.map((category) => {
            const isActive = draft.categoryId === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryPill, isActive && { backgroundColor: category.color }]}
                onPress={() => setDraft((current) => ({ ...current, categoryId: category.id }))}
              >
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>{category.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}
      <TextInput
        style={styles.textField}
        value={draft.note}
        onChangeText={(value) => setDraft((current) => ({ ...current, note: value }))}
        placeholder="Note"
        placeholderTextColor="rgba(16,36,29,0.42)"
      />
      <TouchableOpacity style={styles.primaryButton} onPress={addTransaction}>
        <Text style={styles.primaryButtonText}>Add Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

function defaultTransactionNote(type: TransactionType, budget: BudgetState, categoryId: string) {
  if (type === 'expense') {
    return budget.categories.find((category) => category.id === categoryId)?.label ?? 'Expense';
  }
  if (type === 'income') return 'Money added';
  if (type === 'transfer') return 'Moved to savings';
  if (type === 'goal') return 'Goal contribution';
  return 'Invested cash';
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.panelEyebrow}>{eyebrow}</Text>
      <Text style={styles.panelTitle}>{title}</Text>
    </View>
  );
}

function MoneyField({
  label,
  value,
  prefix = '$',
  onChangeText,
}: {
  label: string;
  value: string;
  prefix?: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.moneyField}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.moneyInputWrap}>
        {prefix ? <Text style={styles.moneyPrefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.moneyInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="rgba(16,36,29,0.42)"
        />
      </View>
    </View>
  );
}

function OptionRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: Array<{ id: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.optionBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
          const isActive = selected === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionButton, isActive && styles.optionButtonActive]}
              onPress={() => onSelect(option.id)}
            >
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function BudgetAmountRow({
  color,
  label,
  meta,
  value,
  onChangeText,
}: {
  color: string;
  label: string;
  meta: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.amountRow}>
      <View style={styles.amountRowLeft}>
        <View style={[styles.colorRail, { backgroundColor: color }]} />
        <View style={styles.amountTextBlock}>
          <Text style={styles.rowTitle}>{label}</Text>
          <Text style={styles.rowMeta}>{meta}</Text>
        </View>
      </View>
      <View style={styles.amountInputWrap}>
        <Text style={styles.amountDollar}>$</Text>
        <TextInput
          style={styles.amountInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="rgba(16,36,29,0.42)"
        />
      </View>
    </View>
  );
}

function MetricStrip({
  items,
}: {
  items: Array<{ label: string; value: string; tone?: 'good' | 'bad' | 'warn' }>;
}) {
  return (
    <View style={styles.metricStrip}>
      {items.map((item) => (
        <View key={item.label} style={styles.metricStripItem}>
          <Text style={styles.metricStripLabel}>{item.label}</Text>
          <Text style={[
            styles.metricStripValue,
            item.tone === 'good' && styles.goodText,
            item.tone === 'bad' && styles.badText,
            item.tone === 'warn' && styles.warnText,
          ]}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'good' | 'bad' | 'warn';
}) {
  return (
    <View style={styles.metricTile}>
      <Text style={styles.metricTileLabel}>{label}</Text>
      <Text style={[
        styles.metricTileValue,
        tone === 'good' && styles.goodText,
        tone === 'bad' && styles.badText,
        tone === 'warn' && styles.warnText,
      ]}>
        {value}
      </Text>
    </View>
  );
}

function RuleCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.ruleCard}>
      <Text style={styles.ruleLabel}>{label}</Text>
      <Text style={styles.ruleValue}>{value}</Text>
    </View>
  );
}

function EnvelopeRow({ category, spent }: { category: BudgetCategory; spent: number }) {
  const percent = category.limit > 0 ? Math.min(100, (spent / category.limit) * 100) : 0;
  const remaining = category.limit - spent;

  return (
    <View style={styles.envelopeRow}>
      <View style={styles.envelopeHeader}>
        <View style={styles.amountRowLeft}>
          <View style={[styles.colorRail, { backgroundColor: category.color }]} />
          <View style={styles.amountTextBlock}>
            <Text style={styles.rowTitle}>{category.label}</Text>
            <Text style={styles.rowMeta}>{formatCurrency(spent)} of {formatCurrency(category.limit)}</Text>
          </View>
        </View>
        <Text style={[styles.envelopeRemaining, remaining >= 0 ? styles.goodText : styles.badText]}>
          {formatCurrency(remaining)}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: remaining >= 0 ? category.color : '#DC2626' }]} />
      </View>
    </View>
  );
}

function LedgerRow({ transaction, budget }: { transaction: BudgetTransaction; budget: BudgetState }) {
  const category = budget.categories.find((item) => item.id === transaction.categoryId);
  const isPositive = transaction.type === 'income';
  const prefix = isPositive ? '+' : '-';

  return (
    <View style={styles.ledgerRow}>
      <View>
        <Text style={styles.rowTitle}>{transaction.note}</Text>
        <Text style={styles.rowMeta}>{transaction.type} / {category?.label ?? 'Account'} / {new Date(transaction.date).toLocaleDateString()}</Text>
      </View>
      <Text style={[styles.ledgerAmount, isPositive ? styles.goodText : styles.badText]}>
        {prefix}{formatCurrency(transaction.amount)}
      </Text>
    </View>
  );
}

function HoldingRow({ holding, portfolioValue }: { holding: Holding; portfolioValue: number }) {
  const value = holding.shares * holding.currentPrice;
  const cost = holding.shares * holding.avgCost;
  const pl = value - cost;
  const actualWeight = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;

  return (
    <View style={styles.holdingRow}>
      <View style={styles.holdingTop}>
        <View>
          <Text style={styles.rowTitle}>{holding.ticker} / {holding.name}</Text>
          <Text style={styles.rowMeta}>{holding.assetClass} / {holding.shares.toLocaleString()} shares</Text>
        </View>
        <Text style={styles.rowValue}>{formatCurrency(value)}</Text>
      </View>
      <View style={styles.holdingStats}>
        <RuleCard label="P/L" value={formatCurrency(pl)} />
        <RuleCard label="Actual" value={formatPercent(actualWeight)} />
        <RuleCard label="Target" value={formatPercent(holding.targetWeight)} />
      </View>
    </View>
  );
}

function GoalRow({
  goal,
  setBudget,
}: {
  goal: Goal;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
}) {
  const percent = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
  const remaining = Math.max(0, goal.target - goal.saved);
  const monthlyNeeded = monthsUntil(goal.dueMonth) > 0 ? remaining / monthsUntil(goal.dueMonth) : remaining;

  const contribute = () => {
    const amount = Math.max(25, goal.monthlyContribution || monthlyNeeded);
    setBudget((current) => current ? {
      ...current,
      checkingBalance: roundCurrency(Math.max(0, current.checkingBalance - amount)),
      savingsBalance: roundCurrency(current.savingsBalance + amount),
      goals: current.goals.map((existing) => (
        existing.id === goal.id
          ? { ...existing, saved: Math.min(existing.target, roundCurrency(existing.saved + amount)) }
          : existing
      )),
      transactions: [{
        id: makeId('tx'),
        type: 'goal',
        amount,
        note: `${goal.name} contribution`,
        date: new Date().toISOString(),
      }, ...current.transactions],
    } : current);
  };

  return (
    <View style={styles.goalRow}>
      <View style={styles.goalTopLine}>
        <View>
          <Text style={styles.rowTitle}>{goal.name}</Text>
          <Text style={styles.rowMeta}>{goal.priority} priority / due {goal.dueMonth}</Text>
        </View>
        <Text style={styles.rowValue}>{formatPercent(percent)}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: '#CA8A04' }]} />
      </View>
      <View style={styles.goalBottomLine}>
        <Text style={styles.rowMeta}>{formatCurrency(goal.saved)} saved / {formatCurrency(remaining)} left</Text>
        <TouchableOpacity style={styles.smallButton} onPress={contribute}>
          <Text style={styles.smallButtonText}>Fund</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.rowMeta}>Needed pace: {formatCurrency(monthlyNeeded)} per month</Text>
    </View>
  );
}

function InsightRow({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: 'good' | 'bad' | 'warn';
}) {
  return (
    <View style={[styles.insightRow, tone === 'good' && styles.goodPanel, tone === 'bad' && styles.badPanel, tone === 'warn' && styles.warnPanel]}>
      <Text style={styles.insightTitle}>{title}</Text>
      <Text style={styles.insightBody}>{body}</Text>
    </View>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

function monthsUntil(dueMonth: string) {
  const [yearText, monthText] = dueMonth.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return 0;
  const today = new Date();
  const due = new Date(year, month - 1, 1);
  const months = (due.getFullYear() - today.getFullYear()) * 12 + due.getMonth() - today.getMonth();
  return Math.max(1, months);
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 28,
  },
  setupHero: {
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 18,
    backgroundColor: colors.white,
  },
  eyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
  },
  title: {
    marginTop: 6,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 36,
    lineHeight: 40,
    includeFontPadding: false,
  },
  body: {
    marginTop: 12,
    color: colors.black,
    fontSize: 15,
    lineHeight: 22,
  },
  stepper: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 8,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  stepDotActive: {
    backgroundColor: colors.black,
  },
  stepDotText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  stepDotTextActive: {
    color: colors.yellow,
  },
  stepLabel: {
    marginTop: 6,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 13,
    opacity: 0.55,
  },
  stepLabelActive: {
    opacity: 1,
  },
  setupPanel: {
    marginTop: 18,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.black,
  },
  panel: {
    marginTop: 18,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.black,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  panelEyebrow: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  panelTitle: {
    marginTop: 4,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    lineHeight: 28,
    includeFontPadding: false,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  moneyField: {
    flex: 1,
    marginBottom: 12,
  },
  inputLabel: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    marginBottom: 6,
  },
  moneyInputWrap: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.24)',
    borderRadius: 8,
    backgroundColor: '#F8F3E7',
    paddingHorizontal: 12,
  },
  moneyPrefix: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    marginRight: 6,
  },
  moneyInput: {
    flex: 1,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
    padding: 0,
  },
  textField: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.24)',
    borderRadius: 8,
    backgroundColor: '#F8F3E7',
    paddingHorizontal: 12,
    color: colors.black,
    fontSize: 16,
    marginBottom: 12,
  },
  optionBlock: {
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.24)',
    justifyContent: 'center',
    backgroundColor: '#F8F3E7',
  },
  optionButtonActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  optionText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  optionTextActive: {
    color: colors.yellow,
  },
  setupFooter: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 19,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 19,
  },
  disabledButton: {
    opacity: 0.35,
  },
  smallButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  smallButtonText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  metricStrip: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  metricStripItem: {
    flex: 1,
    minHeight: 74,
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.2)',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-between',
    backgroundColor: '#F8F3E7',
  },
  metricStripLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
  },
  metricStripValue: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 21,
  },
  amountRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,36,29,0.14)',
    paddingVertical: 10,
  },
  amountRowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  colorRail: {
    width: 8,
    height: 38,
    borderRadius: 4,
    marginRight: 10,
  },
  amountTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    color: colors.black,
    fontWeight: '800',
    fontSize: 15,
  },
  rowMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  amountInputWrap: {
    width: 112,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.24)',
    borderRadius: 8,
    backgroundColor: '#F8F3E7',
    paddingHorizontal: 10,
  },
  amountDollar: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    padding: 0,
    textAlign: 'right',
  },
  scenarioPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.22)',
    backgroundColor: '#F8F3E7',
    padding: 14,
  },
  scenarioTitle: {
    color: colors.black,
    fontWeight: '800',
    fontSize: 16,
  },
  scenarioValue: {
    marginTop: 10,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 34,
  },
  scenarioBody: {
    marginTop: 8,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
  },
  ruleGrid: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  ruleCard: {
    flex: 1,
    minHeight: 64,
    borderRadius: 8,
    backgroundColor: '#F8F3E7',
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.16)',
    padding: 10,
    justifyContent: 'space-between',
  },
  ruleLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 13,
  },
  ruleValue: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
  },
  commandCenter: {
    backgroundColor: colors.black,
    borderRadius: 8,
    padding: 18,
  },
  commandTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  commandTitle: {
    marginTop: 6,
    color: colors.yellow,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    lineHeight: 34,
    includeFontPadding: false,
  },
  commandBody: {
    marginTop: 12,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
  },
  rebuildButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
  },
  rebuildButtonText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  heroMetrics: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricTile: {
    width: '48.5%',
    minHeight: 82,
    borderRadius: 8,
    backgroundColor: 'rgba(255,253,244,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,253,244,0.14)',
    padding: 12,
    justifyContent: 'space-between',
  },
  metricTileLabel: {
    color: '#D8D2BE',
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
  },
  metricTileValue: {
    color: colors.white,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 25,
  },
  viewTabs: {
    marginTop: 14,
  },
  viewTabsContent: {
    gap: 8,
    paddingRight: 4,
  },
  viewTab: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,253,244,0.24)',
  },
  viewTabActive: {
    backgroundColor: colors.black,
  },
  viewTabText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  viewTabTextActive: {
    color: colors.yellow,
  },
  healthRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionTypeRow: {
    gap: 8,
    marginBottom: 12,
  },
  actionTypeButton: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.24)',
    justifyContent: 'center',
    backgroundColor: '#F8F3E7',
  },
  actionTypeButtonActive: {
    backgroundColor: colors.black,
  },
  actionTypeText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  actionTypeTextActive: {
    color: colors.yellow,
  },
  categoryPicker: {
    gap: 8,
    marginBottom: 12,
  },
  categoryPill: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#F8F3E7',
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.16)',
  },
  categoryPillText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  categoryPillTextActive: {
    color: colors.white,
  },
  envelopeRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,36,29,0.14)',
    paddingTop: 12,
    marginTop: 10,
  },
  envelopeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  envelopeRemaining: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
  },
  progressTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: '#E7DDC8',
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  ledgerRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,36,29,0.14)',
    paddingVertical: 10,
  },
  ledgerAmount: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  holdingRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,36,29,0.14)',
    paddingTop: 12,
    marginTop: 10,
  },
  holdingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  holdingStats: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  rowValue: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  goalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,36,29,0.14)',
    paddingTop: 12,
    marginTop: 10,
  },
  goalTopLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  goalBottomLine: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  insightRow: {
    borderRadius: 8,
    padding: 13,
    borderWidth: 1,
    marginTop: 10,
  },
  insightTitle: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 15,
  },
  insightBody: {
    marginTop: 6,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(16,36,29,0.24)',
    padding: 16,
    backgroundColor: '#F8F3E7',
  },
  emptyTitle: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 15,
  },
  emptyBody: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  driftRow: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,36,29,0.14)',
    paddingVertical: 10,
    gap: 12,
  },
  driftValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  goodText: {
    color: colors.positive,
  },
  badText: {
    color: colors.negative,
  },
  warnText: {
    color: '#A16207',
  },
  goodPanel: {
    backgroundColor: '#ECFDF3',
    borderColor: '#86EFAC',
  },
  badPanel: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  warnPanel: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
});
