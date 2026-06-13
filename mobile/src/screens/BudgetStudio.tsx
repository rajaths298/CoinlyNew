import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { budgetStorageKey } from '../services/budgetStorage';
import DonutChart, { type DonutSegment } from '../components/budget/DonutChart';
import { AnimatedNumber } from '../components/ui/animations';
import { appColors as colors } from '../theme';
import type { OnboardingProfile } from '../types/onboarding';

type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
type RiskMode = 'guarded' | 'balanced' | 'growth';
type BudgetView = 'overview' | 'plan' | 'cashflow' | 'invest' | 'goals' | 'manage' | 'review';
type TransactionType = 'income' | 'expense' | 'goal' | 'investment' | 'transfer';

const investmentAccountPresets = ['Brokerage', '401k', 'Roth IRA', 'IRA', 'Crypto', 'HSA'];

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
  emergencyFundTarget: string;
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
  account: string;
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

type RecurringBill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  categoryId?: string;
  autopay: boolean;
};

type Debt = {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
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
  emergencyFundTarget: number;
  emergencyFundSaved: number;
  categories: BudgetCategory[];
  transactions: BudgetTransaction[];
  holdings: Holding[];
  goals: Goal[];
  bills: RecurringBill[];
  debts: Debt[];
};

type BudgetSessionSnapshot = {
  setupStep: number;
  setupComplete: boolean;
  setupSkipped: boolean;
  draft: SetupDraft;
  categoryDrafts: CategoryDraft[];
  billDrafts: RecurringBill[];
  debtDrafts: Debt[];
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
  account: string;
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

type BillDraft = {
  name: string;
  amount: string;
  dueDay: string;
};

type DebtDraft = {
  name: string;
  balance: string;
  apr: string;
  minPayment: string;
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
  { id: 'manage', label: 'Manage' },
  { id: 'review', label: 'Review' },
];

const setupSteps = ['Snapshot', 'Plan', 'Future', 'Stress'];

// Keyword → category id used to auto-tag expenses as the note is typed. Falls back to
// undefined so manual selection still wins when nothing matches.
const categoryKeywords: Array<{ id: string; words: string[] }> = [
  { id: 'housing', words: ['rent', 'mortgage', 'landlord', 'lease', 'hoa'] },
  { id: 'food', words: ['grocery', 'groceries', 'restaurant', 'coffee', 'starbucks', 'lunch', 'dinner', 'food', 'cafe', 'doordash', 'ubereats', 'mcdonald', 'pizza', 'snack'] },
  { id: 'transport', words: ['uber', 'lyft', 'gas', 'fuel', 'transit', 'metro', 'bus', 'train', 'parking', 'car', 'toll'] },
  { id: 'utilities', words: ['electric', 'water', 'internet', 'wifi', 'phone', 'gas bill', 'utility', 'utilities', 'power'] },
  { id: 'health', words: ['doctor', 'pharmacy', 'gym', 'dentist', 'medical', 'health', 'clinic', 'therapy'] },
  { id: 'subscriptions', words: ['netflix', 'spotify', 'hulu', 'disney', 'subscription', 'prime', 'icloud', 'youtube', 'patreon', 'apple'] },
  { id: 'shopping', words: ['amazon', 'target', 'walmart', 'clothes', 'shoes', 'shopping', 'mall', 'store'] },
  { id: 'fun', words: ['movie', 'game', 'concert', 'bar', 'drinks', 'fun', 'entertainment', 'travel', 'trip', 'vacation'] },
  { id: 'debt', words: ['loan', 'credit card', 'card payment', 'student loan', 'debt'] },
];

function autoCategorizeNote(note: string): string | undefined {
  const text = note.trim().toLowerCase();
  if (!text) return undefined;
  for (const entry of categoryKeywords) {
    if (entry.words.some((word) => text.includes(word))) return entry.id;
  }
  return undefined;
}

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
  const income = savingHabit === 'Consistent' ? 5200 : savingHabit === 'Sometimes' ? 3800 : 2600;

  return {
    monthlyIncome: String(income),
    checkingBalance: '1200',
    savingsBalance: savingHabit === 'Consistent' ? '3500' : '850',
    cashBalance: '120',
    debtBalance: '0',
    debtMinimums: '0',
    emergencyMonths: '3',
    // Rough starting target: ~3 months of essentials (essentials ≈ 55% of income).
    emergencyFundTarget: String(Math.round(income * 0.55 * 3)),
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

function buildBudgetFromDraft(
  draft: SetupDraft,
  categoryDrafts: CategoryDraft[],
  billDrafts: RecurringBill[] = [],
  debtDrafts: Debt[] = [],
): BudgetState {
  const monthlyIncome = parseMoney(draft.monthlyIncome);
  const startingPortfolio = parseMoney(draft.startingPortfolio);
  const monthlyInvesting = parseMoney(draft.monthlyInvesting);
  const firstGoalTarget = parseMoney(draft.firstGoalTarget);
  const firstGoalSaved = parseMoney(draft.firstGoalSaved);
  const firstGoalMonthly = parseMoney(draft.firstGoalMonthly);
  const emergencyMonths = Math.max(1, parseMoney(draft.emergencyMonths));
  const debts = debtDrafts;
  // Prefer the structured debt list; fall back to the single snapshot numbers.
  const debtBalance = debts.length > 0
    ? debts.reduce((sum, debt) => sum + debt.balance, 0)
    : parseMoney(draft.debtBalance);
  const debtMinimums = debts.length > 0
    ? debts.reduce((sum, debt) => sum + debt.minPayment, 0)
    : parseMoney(draft.debtMinimums);

  return {
    monthlyIncome,
    payFrequency: draft.payFrequency,
    riskMode: draft.riskMode,
    priority: draft.priority.trim() || 'Build stability',
    checkingBalance: parseMoney(draft.checkingBalance),
    savingsBalance: parseMoney(draft.savingsBalance),
    cashBalance: parseMoney(draft.cashBalance),
    debtBalance,
    debtMinimums,
    emergencyMonths,
    emergencyFundTarget: parseMoney(draft.emergencyFundTarget),
    emergencyFundSaved: parseMoney(draft.savingsBalance),
    categories: createCategories(categoryDrafts),
    transactions: [],
    bills: billDrafts,
    debts,
    holdings: startingPortfolio > 0 ? [{
      id: makeId('holding'),
      ticker: 'CORE',
      name: 'Starting portfolio',
      assetClass: 'Mixed',
      account: 'Brokerage',
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

// Fills any fields missing from an older saved session (or a preview built before the
// bills/debts/emergency-fund fields existed) so the workspace never reads undefined.
function normalizeBudget(budget: BudgetState): BudgetState {
  const essentialSpend = (Array.isArray(budget.categories) ? budget.categories : [])
    .filter((category) => category.role === 'Essential')
    .reduce((sum, category) => sum + (category.limit ?? 0), 0);
  const emergencyMonths = Math.max(1, budget.emergencyMonths ?? 3);

  return {
    ...budget,
    categories: Array.isArray(budget.categories) ? budget.categories : [],
    transactions: Array.isArray(budget.transactions) ? budget.transactions : [],
    goals: Array.isArray(budget.goals) ? budget.goals : [],
    bills: Array.isArray(budget.bills) ? budget.bills : [],
    debts: Array.isArray(budget.debts) ? budget.debts : [],
    holdings: (Array.isArray(budget.holdings) ? budget.holdings : []).map((holding) => ({
      ...holding,
      account: holding.account ?? 'Brokerage',
    })),
    emergencyMonths,
    emergencyFundTarget: budget.emergencyFundTarget && budget.emergencyFundTarget > 0
      ? budget.emergencyFundTarget
      : Math.round(essentialSpend * emergencyMonths),
    emergencyFundSaved: budget.emergencyFundSaved ?? budget.savingsBalance ?? 0,
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
  const billsTotal = (Array.isArray(budget.bills) ? budget.bills : [])
    .reduce((sum, bill) => sum + bill.amount, 0);
  const remaining = budget.monthlyIncome + extraIncome - totalSpent;

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
    billsTotal,
    remaining,
  };
}

type HealthFactor = { label: string; points: number; max: number; tone: 'good' | 'warn' | 'bad' };

// 0–100 score from five weighted factors. Each factor also returns a one-line
// "what's helping / hurting" note for the Overview card.
function computeHealthScore(budget: BudgetState, metrics: ReturnType<typeof getBudgetMetrics>) {
  const factors: HealthFactor[] = [];

  // Savings rate — target 20%+.
  const savingsPoints = Math.round(Math.max(0, Math.min(1, metrics.savingsRate / 20)) * 25);
  factors.push({
    label: `Saving ${formatPercent(metrics.savingsRate)} of income`,
    points: savingsPoints,
    max: 25,
    tone: metrics.savingsRate >= 20 ? 'good' : metrics.savingsRate >= 10 ? 'warn' : 'bad',
  });

  // Emergency fund coverage — target months of essentials.
  const targetMonths = Math.max(1, budget.emergencyMonths);
  const coveredMonths = metrics.essentialSpend > 0 ? metrics.availableCash / metrics.essentialSpend : targetMonths;
  const emergencyPoints = Math.round(Math.max(0, Math.min(1, coveredMonths / targetMonths)) * 25);
  factors.push({
    label: `${coveredMonths.toFixed(1)} of ${targetMonths} months of reserves`,
    points: emergencyPoints,
    max: 25,
    tone: coveredMonths >= targetMonths ? 'good' : coveredMonths >= targetMonths / 2 ? 'warn' : 'bad',
  });

  // Debt-to-income — lower is better (minimums vs income).
  const dti = budget.monthlyIncome > 0 ? budget.debtMinimums / budget.monthlyIncome : 0;
  const debtPoints = Math.round(Math.max(0, Math.min(1, 1 - dti / 0.36)) * 20);
  factors.push({
    label: budget.debtMinimums > 0 ? `Debt payments are ${formatPercent(dti * 100)} of income` : 'No required debt payments',
    points: debtPoints,
    max: 20,
    tone: dti <= 0.2 ? 'good' : dti <= 0.36 ? 'warn' : 'bad',
  });

  // Budget adherence — plan funded with a surplus.
  const adherencePoints = metrics.plannedSurplus >= 0 ? 20 : budget.monthlyIncome > 0 ? Math.max(0, 20 + Math.round((metrics.plannedSurplus / budget.monthlyIncome) * 20)) : 0;
  factors.push({
    label: metrics.plannedSurplus >= 0 ? 'Every dollar is assigned with room to spare' : 'Plan is over-assigned',
    points: adherencePoints,
    max: 20,
    tone: metrics.plannedSurplus >= 0 ? 'good' : 'bad',
  });

  // Future habits — goals + investing.
  const hasGoals = budget.goals.length > 0;
  const isInvesting = metrics.portfolioValue > 0 || metrics.investmentContributions > 0;
  const habitPoints = (hasGoals ? 5 : 0) + (isInvesting ? 5 : 0);
  factors.push({
    label: hasGoals && isInvesting ? 'Goals set and investing started' : hasGoals ? 'Goals set — start investing next' : isInvesting ? 'Investing — add a savings goal' : 'Add a goal and start investing',
    points: habitPoints,
    max: 10,
    tone: habitPoints >= 10 ? 'good' : habitPoints >= 5 ? 'warn' : 'bad',
  });

  const score = Math.max(0, Math.min(100, factors.reduce((sum, factor) => sum + factor.points, 0)));
  const grade = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';
  const tone: 'good' | 'warn' | 'bad' = score >= 60 ? 'good' : score >= 40 ? 'warn' : 'bad';

  return { score, grade, tone, factors };
}

export default function BudgetStudio({ profile }: { profile: OnboardingProfile }) {
  const [setupStep, setSetupStep] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupSkipped, setSetupSkipped] = useState(false);
  const [draft, setDraft] = useState<SetupDraft>(() => createInitialDraft(profile));
  const [categoryDrafts, setCategoryDrafts] = useState<CategoryDraft[]>(() => (
    createCategoryDrafts(parseMoney(createInitialDraft(profile).monthlyIncome))
  ));
  const [billDrafts, setBillDrafts] = useState<RecurringBill[]>([]);
  const [debtDrafts, setDebtDrafts] = useState<Debt[]>([]);
  const [budget, setBudget] = useState<BudgetState | null>(null);
  const [activeView, setActiveView] = useState<BudgetView>('overview');
  const [isHydrated, setIsHydrated] = useState(false);

  const previewBudget = useMemo(
    () => buildBudgetFromDraft(draft, categoryDrafts, billDrafts, debtDrafts),
    [billDrafts, categoryDrafts, debtDrafts, draft],
  );
  const activeBudget = useMemo(
    () => normalizeBudget(budget ?? previewBudget),
    [budget, previewBudget],
  );
  const metrics = useMemo(() => getBudgetMetrics(activeBudget), [activeBudget]);

  const updateDraft = <K extends keyof SetupDraft>(key: K, value: SetupDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const regeneratePlan = () => {
    setCategoryDrafts(createCategoryDrafts(parseMoney(draft.monthlyIncome)));
  };

  const finishSetup = () => {
    setBudget(buildBudgetFromDraft(draft, categoryDrafts, billDrafts, debtDrafts));
    setSetupComplete(true);
    setSetupSkipped(false);
  };

  // Skip drops the user into the workspace seeded from their (mostly default) preview, and
  // flags the budget so a "Finish your setup" banner invites them back later.
  const skipSetup = () => {
    setBudget(buildBudgetFromDraft(draft, categoryDrafts, billDrafts, debtDrafts));
    setSetupComplete(true);
    setSetupSkipped(true);
  };

  const resetBudget = () => {
    const defaultDraft = createInitialDraft(profile);
    setBudget(null);
    setDraft(defaultDraft);
    setCategoryDrafts(createCategoryDrafts(parseMoney(defaultDraft.monthlyIncome)));
    setBillDrafts([]);
    setDebtDrafts([]);
    setSetupComplete(false);
    setSetupSkipped(false);
    setSetupStep(0);
    setActiveView('overview');
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
        if (typeof saved.setupSkipped === 'boolean') setSetupSkipped(saved.setupSkipped);
        if (saved.draft) setDraft({ ...defaultDraft, ...saved.draft });
        if (Array.isArray(saved.categoryDrafts) && saved.categoryDrafts.length > 0) {
          setCategoryDrafts(saved.categoryDrafts);
        }
        if (Array.isArray(saved.billDrafts)) setBillDrafts(saved.billDrafts);
        if (Array.isArray(saved.debtDrafts)) setDebtDrafts(saved.debtDrafts);
        if (saved.budget) setBudget(normalizeBudget(saved.budget));
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
      setupSkipped,
      draft,
      categoryDrafts,
      billDrafts,
      debtDrafts,
      budget,
      activeView,
    };
    void AsyncStorage.setItem(budgetStorageKey, JSON.stringify(snapshot));
  }, [activeView, billDrafts, budget, categoryDrafts, debtDrafts, draft, isHydrated, setupComplete, setupSkipped, setupStep]);

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
          <Text style={styles.title}>Set up your money in a few quick steps</Text>
          <Text style={styles.body}>
            Add your income, everyday spending, goals, and any investments. We turn it into a simple
            dashboard you can update any time. It only takes a minute, and you can change everything later.
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
            billDrafts={billDrafts}
            setBillDrafts={setBillDrafts}
            regeneratePlan={regeneratePlan}
          />
        ) : setupStep === 2 ? (
          <SetupFuture draft={draft} updateDraft={updateDraft} metrics={metrics} />
        ) : (
          <SetupStress budget={activeBudget} metrics={metrics} />
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

        <TouchableOpacity style={styles.skipButton} onPress={skipSetup}>
          <Text style={styles.skipButtonText}>Skip for now — I'll finish later</Text>
        </TouchableOpacity>
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
      setupSkipped={setupSkipped}
      onRebuild={() => {
        setSetupComplete(false);
        setSetupStep(0);
      }}
      onReset={resetBudget}
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
  billDrafts,
  setBillDrafts,
  regeneratePlan,
}: {
  draft: SetupDraft;
  categoryDrafts: CategoryDraft[];
  setCategoryDrafts: React.Dispatch<React.SetStateAction<CategoryDraft[]>>;
  billDrafts: RecurringBill[];
  setBillDrafts: React.Dispatch<React.SetStateAction<RecurringBill[]>>;
  regeneratePlan: () => void;
}) {
  const assigned = categoryDrafts.reduce((sum, category) => sum + parseMoney(category.value), 0);
  const left = parseMoney(draft.monthlyIncome) - assigned - parseMoney(draft.debtMinimums);

  return (
    <View>
      <View style={styles.setupPanel}>
        <View style={styles.sectionHeaderRow}>
          <SectionHeader eyebrow="STEP 2" title="Monthly spending plan" />
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

      <View style={styles.setupPanel}>
        <SectionHeader eyebrow="RECURRING" title="Bills on autopilot" />
        <Text style={styles.helperText}>
          Add the payments that hit every month — rent, phone, subscriptions. Optional, and editable later.
        </Text>
        <BillEditor bills={billDrafts} onChange={setBillDrafts} />
      </View>
    </View>
  );
}

function SetupFuture({
  draft,
  updateDraft,
  metrics,
}: {
  draft: SetupDraft;
  updateDraft: <K extends keyof SetupDraft>(key: K, value: SetupDraft[K]) => void;
  metrics: ReturnType<typeof getBudgetMetrics>;
}) {
  const suggestedEmergency = Math.round(metrics.essentialSpend * Math.max(1, parseMoney(draft.emergencyMonths)));

  return (
    <View style={styles.setupPanel}>
      <SectionHeader eyebrow="STEP 3" title="Goals and investing" />
      <OptionRow
        label="Risk mode"
        options={Object.entries(riskLabels).map(([id, label]) => ({ id, label }))}
        selected={draft.riskMode}
        onSelect={(value) => updateDraft('riskMode', value as RiskMode)}
      />
      <View style={styles.twoColumn}>
        <MoneyField label="Emergency months" value={draft.emergencyMonths} prefix="" onChangeText={(value) => updateDraft('emergencyMonths', value)} />
        <MoneyField label="Emergency fund target" value={draft.emergencyFundTarget} onChangeText={(value) => updateDraft('emergencyFundTarget', value)} />
      </View>
      {suggestedEmergency > 0 ? (
        <TouchableOpacity style={styles.suggestChip} onPress={() => updateDraft('emergencyFundTarget', String(suggestedEmergency))}>
          <Text style={styles.suggestChipText}>Use suggested {formatCurrency(suggestedEmergency)}</Text>
        </TouchableOpacity>
      ) : null}
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
  setupSkipped,
  onRebuild,
  onReset,
}: {
  budget: BudgetState;
  metrics: ReturnType<typeof getBudgetMetrics>;
  activeView: BudgetView;
  setActiveView: React.Dispatch<React.SetStateAction<BudgetView>>;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
  setupSkipped: boolean;
  onRebuild: () => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.commandCenter}>
        <View style={styles.commandTop}>
          <View>
            <Text style={styles.eyebrow}>YOUR MONEY</Text>
            <Text style={styles.commandTitle}>Personal finance hub</Text>
          </View>
          <TouchableOpacity style={styles.rebuildButton} onPress={() => setActiveView('manage')}>
            <Text style={styles.rebuildButtonText}>Manage</Text>
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

      {setupSkipped ? (
        <TouchableOpacity style={styles.finishSetupBanner} onPress={onRebuild}>
          <View style={styles.finishSetupTextBlock}>
            <Text style={styles.finishSetupTitle}>Finish your setup</Text>
            <Text style={styles.finishSetupBody}>You skipped the quick setup. Tap to personalize your budget — it takes a minute.</Text>
          </View>
          <Text style={styles.finishSetupArrow}>›</Text>
        </TouchableOpacity>
      ) : null}

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
        <GoalsView budget={budget} metrics={metrics} setBudget={setBudget} />
      ) : activeView === 'manage' ? (
        <ManageView budget={budget} setBudget={setBudget} onRebuild={onRebuild} onReset={onReset} />
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
  const health = computeHealthScore(budget, metrics);

  // Spending breakdown by category for the donut + legend (only what's been spent).
  const spendSegments: DonutSegment[] = budget.categories
    .map((category) => ({ value: metrics.categorySpend[category.id] ?? 0, color: category.color, label: category.label }))
    .filter((segment) => segment.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <View>
      <HealthScoreCard health={health} />

      <View style={styles.panel}>
        <SectionHeader eyebrow="THIS MONTH" title="Budget summary" />
        <MetricStrip
          items={[
            { label: 'Income', value: formatCurrency(budget.monthlyIncome + metrics.extraIncome) },
            { label: 'Spent', value: formatCurrency(metrics.totalSpent), tone: 'warn' },
            { label: 'Remaining', value: formatCurrency(metrics.remaining), tone: metrics.remaining >= 0 ? 'good' : 'bad' },
          ]}
        />
        <View style={styles.healthRow}>
          <RuleCard label="Bills / mo" value={formatCurrency(metrics.billsTotal)} />
          <RuleCard label="Over budget" value={String(overBudgetCount)} />
          <RuleCard label="Investing" value={formatCurrency(metrics.investmentContributions)} />
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.sectionHeaderRow}>
          <SectionHeader eyebrow="WHERE IT GOES" title="Spending breakdown" />
          <TouchableOpacity style={styles.smallButton} onPress={() => setActiveView('cashflow')}>
            <Text style={styles.smallButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {spendSegments.length === 0 ? (
          <EmptyState title="No spending logged yet" body="Add an expense below and it appears here, sorted by category." />
        ) : (
          <View style={styles.breakdownRow}>
            <DonutChart
              segments={spendSegments}
              centerValue={formatCurrency(metrics.totalSpent)}
              centerLabel="spent"
            />
            <View style={styles.breakdownLegend}>
              {spendSegments.slice(0, 6).map((segment) => {
                const pct = metrics.totalSpent > 0 ? (segment.value / metrics.totalSpent) * 100 : 0;
                return (
                  <View key={segment.label} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
                    <Text style={styles.legendLabel} numberOfLines={1}>{segment.label}</Text>
                    <Text style={styles.legendValue}>{formatPercent(pct)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
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

      <View style={styles.panel}>
        <SectionHeader eyebrow="SAVINGS & INVESTMENTS" title="The big picture" />
        <View style={styles.summaryGrid}>
          <SummaryTile
            label="Portfolio"
            value={formatCurrency(metrics.portfolioValue)}
            sub={`${metrics.portfolioPL >= 0 ? '+' : ''}${formatCurrency(metrics.portfolioPL)} P/L`}
            tone={metrics.portfolioPL >= 0 ? 'good' : 'bad'}
            onPress={() => setActiveView('invest')}
          />
          <SummaryTile
            label="Emergency fund"
            value={formatCurrency(budget.emergencyFundSaved)}
            sub={`of ${formatCurrency(budget.emergencyFundTarget)} goal`}
            tone={budget.emergencyFundSaved >= budget.emergencyFundTarget && budget.emergencyFundTarget > 0 ? 'good' : 'warn'}
            onPress={() => setActiveView('goals')}
          />
        </View>
      </View>

      <QuickMoneyPanel budget={budget} setBudget={setBudget} />
    </View>
  );
}

function HealthScoreCard({ health }: { health: ReturnType<typeof computeHealthScore> }) {
  const ringColor = health.tone === 'good' ? colors.positive : health.tone === 'warn' ? '#A16207' : colors.negative;
  const segments: DonutSegment[] = [
    { value: health.score, color: ringColor, label: 'score' },
    { value: Math.max(0, 100 - health.score), color: '#E7DDC8', label: 'rest' },
  ];

  return (
    <View style={styles.panel}>
      <SectionHeader eyebrow="FINANCIAL HEALTH" title="Your score" />
      <View style={styles.breakdownRow}>
        <View style={styles.scoreRingWrap}>
          <DonutChart segments={segments} size={132} strokeWidth={16} />
          <View style={styles.scoreRingCenter} pointerEvents="none">
            <AnimatedNumber value={health.score} style={styles.scoreNumber} />
            <Text style={[styles.scoreGrade, { color: ringColor }]}>{health.grade}</Text>
          </View>
        </View>
        <View style={styles.scoreFactors}>
          {health.factors.map((factor) => (
            <View key={factor.label} style={styles.factorRow}>
              <View style={[
                styles.factorDot,
                factor.tone === 'good' && { backgroundColor: colors.positive },
                factor.tone === 'warn' && { backgroundColor: '#A16207' },
                factor.tone === 'bad' && { backgroundColor: colors.negative },
              ]} />
              <Text style={styles.factorLabel} numberOfLines={2}>{factor.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function SummaryTile({
  label,
  value,
  sub,
  tone,
  onPress,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'good' | 'bad' | 'warn';
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.summaryTile} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.summaryTileLabel}>{label}</Text>
      <Text style={styles.summaryTileValue}>{value}</Text>
      <Text style={[
        styles.summaryTileSub,
        tone === 'good' && styles.goodText,
        tone === 'bad' && styles.badText,
        tone === 'warn' && styles.warnText,
      ]}>{sub}</Text>
    </TouchableOpacity>
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
  const emptyHoldingDraft: HoldingDraft = {
    ticker: '',
    name: '',
    assetClass: 'ETF',
    account: 'Brokerage',
    shares: '',
    avgCost: '',
    currentPrice: '',
    monthlyContribution: '',
    targetWeight: '',
  };
  const [draft, setDraft] = useState<HoldingDraft>(emptyHoldingDraft);

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
      account: draft.account.trim() || 'Brokerage',
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
    setDraft(emptyHoldingDraft);
  };

  const deleteHolding = (id: string) => {
    setBudget((current) => current ? {
      ...current,
      holdings: current.holdings.filter((holding) => holding.id !== id),
    } : current);
  };

  // Group holdings by account so each account shows its own subtotal + P/L.
  const accounts = budget.holdings.reduce<Record<string, Holding[]>>((result, holding) => {
    const key = holding.account || 'Brokerage';
    (result[key] = result[key] ?? []).push(holding);
    return result;
  }, {});

  // Allocation by asset class for the donut.
  const allocationPalette = ['#2563EB', '#16A34A', '#DB2777', '#EA580C', '#7C3AED', '#0891B2', '#CA8A04', '#475569'];
  const assetTotals = budget.holdings.reduce<Record<string, number>>((result, holding) => {
    const value = holding.shares * holding.currentPrice;
    result[holding.assetClass] = (result[holding.assetClass] ?? 0) + value;
    return result;
  }, {});
  const allocationSegments: DonutSegment[] = Object.entries(assetTotals)
    .map(([label, value], index) => ({ label, value, color: allocationPalette[index % allocationPalette.length] }))
    .filter((segment) => segment.value > 0)
    .sort((a, b) => b.value - a.value);

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
        {allocationSegments.length > 0 ? (
          <View style={styles.breakdownRow}>
            <DonutChart
              segments={allocationSegments}
              centerValue={formatCurrency(metrics.portfolioValue)}
              centerLabel="value"
            />
            <View style={styles.breakdownLegend}>
              {allocationSegments.slice(0, 6).map((segment) => {
                const pct = metrics.portfolioValue > 0 ? (segment.value / metrics.portfolioValue) * 100 : 0;
                return (
                  <View key={segment.label} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
                    <Text style={styles.legendLabel} numberOfLines={1}>{segment.label}</Text>
                    <Text style={styles.legendValue}>{formatPercent(pct)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>

      {budget.holdings.length === 0 ? (
        <View style={styles.panel}>
          <EmptyState title="No investments yet" body="Add holdings to track value, gains/losses, and allocation across your accounts." />
        </View>
      ) : Object.entries(accounts).map(([accountName, holdings]) => {
        const accountValue = holdings.reduce((sum, holding) => sum + holding.shares * holding.currentPrice, 0);
        const accountCost = holdings.reduce((sum, holding) => sum + holding.shares * holding.avgCost, 0);
        const accountPL = accountValue - accountCost;
        return (
          <View key={accountName} style={styles.panel}>
            <View style={styles.accountHeader}>
              <View>
                <Text style={styles.panelEyebrow}>ACCOUNT</Text>
                <Text style={styles.accountName}>{accountName}</Text>
              </View>
              <View style={styles.accountHeaderRight}>
                <Text style={styles.rowValue}>{formatCurrency(accountValue)}</Text>
                <Text style={[styles.rowMeta, accountPL >= 0 ? styles.goodText : styles.badText]}>
                  {accountPL >= 0 ? '+' : ''}{formatCurrency(accountPL)}
                </Text>
              </View>
            </View>
            {holdings.map((holding) => (
              <HoldingRow
                key={holding.id}
                holding={holding}
                portfolioValue={metrics.portfolioValue}
                onDelete={() => deleteHolding(holding.id)}
              />
            ))}
          </View>
        );
      })}

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
        <Text style={styles.inputLabel}>Account</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPicker}>
          {investmentAccountPresets.map((preset) => {
            const isActive = draft.account === preset;
            return (
              <TouchableOpacity
                key={preset}
                style={[styles.categoryPill, isActive && { backgroundColor: colors.black }]}
                onPress={() => setDraft((current) => ({ ...current, account: preset }))}
              >
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>{preset}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TextInput
          style={styles.textField}
          value={draft.account}
          onChangeText={(value) => setDraft((current) => ({ ...current, account: value }))}
          placeholder="Account name"
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
  metrics: ReturnType<typeof getBudgetMetrics>;
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

  const deleteGoal = (id: string) => {
    setBudget((current) => current ? {
      ...current,
      goals: current.goals.filter((goal) => goal.id !== id),
    } : current);
  };

  // Earmark more of savings as emergency reserve, moving cash from checking → savings.
  const fundEmergency = () => {
    const remaining = Math.max(0, budget.emergencyFundTarget - budget.emergencyFundSaved);
    const amount = remaining > 0 ? Math.min(100, remaining) : 100;
    setBudget((current) => current ? {
      ...current,
      checkingBalance: roundCurrency(Math.max(0, current.checkingBalance - amount)),
      savingsBalance: roundCurrency(current.savingsBalance + amount),
      emergencyFundSaved: roundCurrency(current.emergencyFundSaved + amount),
      transactions: [{
        id: makeId('tx'),
        type: 'goal',
        amount,
        note: 'Emergency fund',
        date: new Date().toISOString(),
      }, ...current.transactions],
    } : current);
  };

  const totalSaved = budget.goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = budget.goals.reduce((sum, goal) => sum + goal.target, 0);
  const emergencyPct = budget.emergencyFundTarget > 0
    ? Math.min(100, (budget.emergencyFundSaved / budget.emergencyFundTarget) * 100)
    : 0;

  return (
    <View>
      <View style={styles.panel}>
        <SectionHeader eyebrow="SAFETY NET" title="Emergency fund" />
        <View style={styles.goalTopLine}>
          <View>
            <Text style={styles.rowTitle}>{formatCurrency(budget.emergencyFundSaved)} saved</Text>
            <Text style={styles.rowMeta}>Target {formatCurrency(budget.emergencyFundTarget)} / {budget.emergencyMonths} months of essentials</Text>
          </View>
          <Text style={styles.rowValue}>{formatPercent(emergencyPct)}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${emergencyPct}%`, backgroundColor: colors.positive }]} />
        </View>
        <View style={styles.goalBottomLine}>
          <Text style={styles.rowMeta}>{formatCurrency(Math.max(0, budget.emergencyFundTarget - budget.emergencyFundSaved))} to go</Text>
          <TouchableOpacity style={styles.smallButton} onPress={fundEmergency}>
            <Text style={styles.smallButtonText}>Add $100</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          <GoalRow key={goal.id} goal={goal} setBudget={setBudget} onDelete={() => deleteGoal(goal.id)} />
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

function ManageView({
  budget,
  setBudget,
  onRebuild,
  onReset,
}: {
  budget: BudgetState;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
  onRebuild: () => void;
  onReset: () => void;
}) {
  type NumericField = 'monthlyIncome' | 'checkingBalance' | 'savingsBalance' | 'cashBalance' | 'emergencyFundTarget' | 'emergencyFundSaved';
  const updateField = (field: NumericField, value: string) => {
    const amount = parseMoney(value);
    setBudget((current) => current ? { ...current, [field]: amount } : current);
  };

  const setBills = (next: RecurringBill[]) => {
    setBudget((current) => current ? { ...current, bills: next } : current);
  };

  // Keep the aggregate debt numbers (used by net worth + health score) in sync with the list.
  const setDebts = (next: Debt[]) => {
    setBudget((current) => current ? {
      ...current,
      debts: next,
      debtBalance: next.reduce((sum, debt) => sum + debt.balance, 0),
      debtMinimums: next.reduce((sum, debt) => sum + debt.minPayment, 0),
    } : current);
  };

  const confirmReset = () => {
    Alert.alert(
      'Reset budget?',
      'This clears everything and restarts the setup wizard. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: onReset },
      ],
    );
  };

  return (
    <View>
      <View style={styles.panel}>
        <SectionHeader eyebrow="MANAGE FINANCIAL DATA" title="Income & balances" />
        <Text style={styles.helperText}>Update these any time your situation changes. Everything saves automatically.</Text>
        <MoneyField label="Monthly take-home" value={String(budget.monthlyIncome)} onChangeText={(value) => updateField('monthlyIncome', value)} />
        <View style={styles.twoColumn}>
          <MoneyField label="Checking" value={String(budget.checkingBalance)} onChangeText={(value) => updateField('checkingBalance', value)} />
          <MoneyField label="Savings" value={String(budget.savingsBalance)} onChangeText={(value) => updateField('savingsBalance', value)} />
        </View>
        <View style={styles.twoColumn}>
          <MoneyField label="Cash" value={String(budget.cashBalance)} onChangeText={(value) => updateField('cashBalance', value)} />
          <MoneyField label="Emergency target" value={String(budget.emergencyFundTarget)} onChangeText={(value) => updateField('emergencyFundTarget', value)} />
        </View>
      </View>

      <View style={styles.panel}>
        <SectionHeader eyebrow="RECURRING" title="Bills & payments" />
        <BillEditor bills={budget.bills} onChange={setBills} categories={budget.categories} />
      </View>

      <View style={styles.panel}>
        <SectionHeader eyebrow="DEBTS" title="What you owe" />
        <Text style={styles.helperText}>Optional. Tracking balances and minimums sharpens your health score.</Text>
        <DebtEditor debts={budget.debts} onChange={setDebts} />
      </View>

      <View style={styles.panel}>
        <SectionHeader eyebrow="DANGER ZONE" title="Reset & rebuild" />
        <TouchableOpacity style={styles.primaryButton} onPress={onRebuild}>
          <Text style={styles.primaryButtonText}>Re-run setup wizard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.deleteWideButton, { marginTop: 10 }]} onPress={confirmReset}>
          <Text style={styles.deleteButtonText}>Reset everything</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BillEditor({
  bills,
  onChange,
  categories,
}: {
  bills: RecurringBill[];
  onChange: (next: RecurringBill[]) => void;
  categories?: BudgetCategory[];
}) {
  const [draft, setDraft] = useState<BillDraft>({ name: '', amount: '', dueDay: '' });

  const addBill = () => {
    const amount = parseMoney(draft.amount);
    if (!draft.name.trim() || amount <= 0) return;
    const dueDay = Math.min(31, Math.max(1, Math.round(parseMoney(draft.dueDay)) || 1));
    const bill: RecurringBill = {
      id: makeId('bill'),
      name: draft.name.trim(),
      amount,
      dueDay,
      categoryId: categories ? autoCategorizeNote(draft.name) : undefined,
      autopay: false,
    };
    onChange([bill, ...bills]);
    setDraft({ name: '', amount: '', dueDay: '' });
  };

  return (
    <View>
      {bills.length === 0 ? (
        <EmptyState title="No bills yet" body="Add the payments that repeat every month so they're never a surprise." />
      ) : bills.map((bill) => (
        <View key={bill.id} style={styles.ledgerRow}>
          <View>
            <Text style={styles.rowTitle}>{bill.name}</Text>
            <Text style={styles.rowMeta}>Due day {bill.dueDay}{bill.autopay ? ' / autopay' : ''}</Text>
          </View>
          <View style={styles.holdingTopRight}>
            <Text style={styles.ledgerAmount}>{formatCurrency(bill.amount)}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(bill.name, () => onChange(bills.filter((item) => item.id !== bill.id)))}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.twoColumn}>
        <TextInput
          style={[styles.textField, { flex: 2 }]}
          value={draft.name}
          onChangeText={(value) => setDraft((current) => ({ ...current, name: value }))}
          placeholder="Bill name"
          placeholderTextColor="rgba(16,36,29,0.42)"
        />
        <TextInput
          style={styles.textField}
          value={draft.dueDay}
          onChangeText={(value) => setDraft((current) => ({ ...current, dueDay: value }))}
          placeholder="Day"
          placeholderTextColor="rgba(16,36,29,0.42)"
          keyboardType="number-pad"
        />
      </View>
      <MoneyField label="Amount" value={draft.amount} onChangeText={(value) => setDraft((current) => ({ ...current, amount: value }))} />
      <TouchableOpacity style={styles.smallButtonWide} onPress={addBill}>
        <Text style={styles.smallButtonText}>Add bill</Text>
      </TouchableOpacity>
    </View>
  );
}

function DebtEditor({
  debts,
  onChange,
}: {
  debts: Debt[];
  onChange: (next: Debt[]) => void;
}) {
  const [draft, setDraft] = useState<DebtDraft>({ name: '', balance: '', apr: '', minPayment: '' });

  const addDebt = () => {
    const balance = parseMoney(draft.balance);
    if (!draft.name.trim() || balance <= 0) return;
    const debt: Debt = {
      id: makeId('debt'),
      name: draft.name.trim(),
      balance,
      apr: parseMoney(draft.apr),
      minPayment: parseMoney(draft.minPayment),
    };
    onChange([debt, ...debts]);
    setDraft({ name: '', balance: '', apr: '', minPayment: '' });
  };

  return (
    <View>
      {debts.length === 0 ? (
        <EmptyState title="No debts tracked" body="Nice. If you do carry a balance, add it here to see payoff pressure." />
      ) : debts.map((debt) => (
        <View key={debt.id} style={styles.ledgerRow}>
          <View>
            <Text style={styles.rowTitle}>{debt.name}</Text>
            <Text style={styles.rowMeta}>{formatPercent(debt.apr)} APR / min {formatCurrency(debt.minPayment)}/mo</Text>
          </View>
          <View style={styles.holdingTopRight}>
            <Text style={styles.ledgerAmount}>{formatCurrency(debt.balance)}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(debt.name, () => onChange(debts.filter((item) => item.id !== debt.id)))}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TextInput
        style={styles.textField}
        value={draft.name}
        onChangeText={(value) => setDraft((current) => ({ ...current, name: value }))}
        placeholder="Debt name (e.g. Visa, Student loan)"
        placeholderTextColor="rgba(16,36,29,0.42)"
      />
      <View style={styles.twoColumn}>
        <MoneyField label="Balance" value={draft.balance} onChangeText={(value) => setDraft((current) => ({ ...current, balance: value }))} />
        <MoneyField label="APR %" value={draft.apr} prefix="" onChangeText={(value) => setDraft((current) => ({ ...current, apr: value }))} />
      </View>
      <MoneyField label="Minimum payment" value={draft.minPayment} onChangeText={(value) => setDraft((current) => ({ ...current, minPayment: value }))} />
      <TouchableOpacity style={styles.smallButtonWide} onPress={addDebt}>
        <Text style={styles.smallButtonText}>Add debt</Text>
      </TouchableOpacity>
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
  const [manualCategory, setManualCategory] = useState(false);
  const [draft, setDraft] = useState<ActionDraft>({
    amount: '',
    categoryId: budget.categories[0]?.id ?? '',
    note: '',
  });

  // Auto-tag expenses from the note as the user types, unless they've picked a
  // category by hand. e.g. "netflix" → Subscriptions, "uber" → Transport.
  const handleNoteChange = (value: string) => {
    setDraft((current) => {
      if (type !== 'expense' || manualCategory) return { ...current, note: value };
      const match = autoCategorizeNote(value);
      if (match && budget.categories.some((category) => category.id === match)) {
        return { ...current, note: value, categoryId: match };
      }
      return { ...current, note: value };
    });
  };

  const autoMatch = type === 'expense' && !manualCategory ? autoCategorizeNote(draft.note) : undefined;
  const autoMatchLabel = autoMatch
    ? budget.categories.find((category) => category.id === autoMatch)?.label
    : undefined;

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
    setManualCategory(false);
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
              onPress={() => { setType(option); setManualCategory(false); }}
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
      <TextInput
        style={styles.textField}
        value={draft.note}
        onChangeText={handleNoteChange}
        placeholder={type === 'expense' ? 'What was it? (e.g. Netflix, Uber, groceries)' : 'Note'}
        placeholderTextColor="rgba(16,36,29,0.42)"
      />
      {type === 'expense' ? (
        <>
          {autoMatchLabel ? (
            <Text style={styles.autoTagHint}>Auto-tagged as {autoMatchLabel} — tap another to change</Text>
          ) : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPicker}>
            {budget.categories.map((category) => {
              const isActive = draft.categoryId === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryPill, isActive && { backgroundColor: category.color }]}
                  onPress={() => { setManualCategory(true); setDraft((current) => ({ ...current, categoryId: category.id })); }}
                >
                  <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>{category.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      ) : null}
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

function HoldingRow({
  holding,
  portfolioValue,
  onDelete,
}: {
  holding: Holding;
  portfolioValue: number;
  onDelete?: () => void;
}) {
  const value = holding.shares * holding.currentPrice;
  const cost = holding.shares * holding.avgCost;
  const pl = value - cost;
  const plPct = cost > 0 ? (pl / cost) * 100 : 0;
  const actualWeight = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;

  return (
    <View style={styles.holdingRow}>
      <View style={styles.holdingTop}>
        <View style={styles.holdingTitleBlock}>
          <Text style={styles.rowTitle}>{holding.ticker} / {holding.name}</Text>
          <Text style={styles.rowMeta}>{holding.assetClass} / {holding.shares.toLocaleString()} shares</Text>
        </View>
        <View style={styles.holdingTopRight}>
          <Text style={styles.rowValue}>{formatCurrency(value)}</Text>
          {onDelete ? (
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(`${holding.ticker}`, onDelete)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <View style={styles.holdingStats}>
        <RuleCard label="P/L" value={`${pl >= 0 ? '+' : ''}${formatCurrency(pl)}`} />
        <RuleCard label="Return" value={`${plPct >= 0 ? '+' : ''}${formatPercent(plPct)}`} />
        <RuleCard label="Weight" value={formatPercent(actualWeight)} />
      </View>
    </View>
  );
}

function confirmDelete(name: string, onConfirm: () => void) {
  Alert.alert('Delete?', `Remove ${name}? This can't be undone.`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}

function GoalRow({
  goal,
  setBudget,
  onDelete,
}: {
  goal: Goal;
  setBudget: React.Dispatch<React.SetStateAction<BudgetState | null>>;
  onDelete?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
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

  const updateGoalField = (field: 'target' | 'saved' | 'monthlyContribution', value: string) => {
    const amount = parseMoney(value);
    setBudget((current) => current ? {
      ...current,
      goals: current.goals.map((existing) => {
        if (existing.id !== goal.id) return existing;
        const next = { ...existing, [field]: amount };
        next.saved = Math.min(next.saved, next.target);
        return next;
      }),
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
        <View style={styles.rowActions}>
          <TouchableOpacity style={styles.ghostButton} onPress={() => setIsEditing((value) => !value)}>
            <Text style={styles.ghostButtonText}>{isEditing ? 'Done' : 'Edit'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={contribute}>
            <Text style={styles.smallButtonText}>Fund</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isEditing ? (
        <View style={styles.editGrid}>
          <View style={styles.twoColumn}>
            <MoneyField label="Target" value={String(goal.target)} onChangeText={(value) => updateGoalField('target', value)} />
            <MoneyField label="Saved" value={String(goal.saved)} onChangeText={(value) => updateGoalField('saved', value)} />
          </View>
          <MoneyField label="Monthly" value={String(goal.monthlyContribution)} onChangeText={(value) => updateGoalField('monthlyContribution', value)} />
          {onDelete ? (
            <TouchableOpacity style={styles.deleteWideButton} onPress={() => confirmDelete(goal.name, onDelete)}>
              <Text style={styles.deleteButtonText}>Delete goal</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <Text style={styles.rowMeta}>Needed pace: {formatCurrency(monthlyNeeded)} per month</Text>
      )}
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

  // --- Enhancement additions ---
  helperText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: -6,
    marginBottom: 12,
  },
  suggestChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
    marginTop: -2,
    marginBottom: 12,
  },
  suggestChipText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  skipButton: {
    marginTop: 6,
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipButtonText: {
    color: colors.muted,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  finishSetupBanner: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: colors.yellow,
    borderRadius: 8,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.black,
  },
  finishSetupTextBlock: {
    flex: 1,
  },
  finishSetupTitle: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 16,
  },
  finishSetupBody: {
    marginTop: 4,
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
  },
  finishSetupArrow: {
    color: colors.black,
    fontSize: 30,
    fontWeight: '700',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  breakdownLegend: {
    flex: 1,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    color: colors.black,
    fontSize: 13,
    fontWeight: '700',
  },
  legendValue: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  scoreRingWrap: {
    width: 132,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRingCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 42,
    includeFontPadding: false,
  },
  scoreGrade: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    marginTop: -4,
  },
  scoreFactors: {
    flex: 1,
    gap: 8,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  factorDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 3,
    backgroundColor: colors.muted,
  },
  factorLabel: {
    flex: 1,
    color: colors.black,
    fontSize: 12,
    lineHeight: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryTile: {
    flex: 1,
    minHeight: 90,
    borderWidth: 1,
    borderColor: 'rgba(16,36,29,0.16)',
    borderRadius: 8,
    backgroundColor: '#F8F3E7',
    padding: 12,
    justifyContent: 'space-between',
  },
  summaryTileLabel: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
  },
  summaryTileValue: {
    marginTop: 4,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
  },
  summaryTileSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 4,
  },
  accountName: {
    marginTop: 2,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  accountHeaderRight: {
    alignItems: 'flex-end',
  },
  holdingTitleBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  holdingTopRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  deleteButton: {
    minHeight: 30,
    paddingHorizontal: 10,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.negative,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: colors.negative,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
  },
  deleteWideButton: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.negative,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ghostButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  editGrid: {
    marginTop: 12,
  },
  autoTagHint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  smallButtonWide: {
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
});
