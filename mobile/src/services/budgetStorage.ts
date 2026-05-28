import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FinancialContext } from './aiAdvisor';
import type { OnboardingProfile, QuizAnswers } from '../types/onboarding';

export const budgetStorageKey = 'coinly-budget-studio-v1';

type StoredBudgetTransaction = {
  id: string;
  type: 'income' | 'expense' | 'goal' | 'investment' | 'transfer';
  amount: number;
  categoryId?: string;
  note: string;
  date: string;
};

type StoredBudgetCategory = {
  id: string;
  label: string;
  limit: number;
};

type StoredHolding = {
  name: string;
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
};

type StoredGoal = {
  name: string;
  target: number;
  saved: number;
};

type StoredBudgetState = {
  monthlyIncome: number;
  categories: StoredBudgetCategory[];
  transactions: StoredBudgetTransaction[];
  holdings: StoredHolding[];
  goals: StoredGoal[];
};

type StoredBudgetSession = {
  budget?: StoredBudgetState | null;
  setupComplete?: boolean;
};

export type CoinlyAppContext = {
  screen: string;
  pageTitle?: string;
  lessonTitle?: string;
  gameTitle?: string;
  userName?: string;
  answers?: QuizAnswers;
};

function safeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function firstAnswer(profile: OnboardingProfile | null, key: string, fallback: string) {
  return profile?.answers[key]?.[0] ?? fallback;
}

function sameDate(date: string, target: Date) {
  const parsed = new Date(date);
  return !Number.isNaN(parsed.getTime()) && parsed.toDateString() === target.toDateString();
}

function categoryLabel(budget: StoredBudgetState, categoryId?: string) {
  if (!categoryId) return 'Account';
  const categories = Array.isArray(budget.categories) ? budget.categories : [];
  return categories.find((category) => category.id === categoryId)?.label ?? categoryId;
}

function defaultFinancialContext(profile: OnboardingProfile | null, app: CoinlyAppContext): FinancialContext {
  const savingHabit = firstAnswer(profile, 'savingHabit', 'Just starting');
  const dailyBudget = savingHabit === 'Consistent' ? 100 : savingHabit === 'Sometimes' ? 65 : 40;

  return {
    dailyBudget,
    totalSpentToday: 0,
    safeToSpend: dailyBudget,
    streak: 0,
    spareChangeStash: 0,
    holdings: [],
    totalPortfolioValue: 0,
    totalPL: 0,
    goals: [],
    recentTransactions: [],
    app,
  };
}

async function readStoredBudgetSession(): Promise<StoredBudgetSession | null> {
  const raw = await AsyncStorage.getItem(budgetStorageKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredBudgetSession;
  } catch {
    return null;
  }
}

export async function buildCoinlyFinancialContext(
  profile: OnboardingProfile | null,
  app: CoinlyAppContext,
): Promise<FinancialContext> {
  const saved = await readStoredBudgetSession();
  const budget = saved?.budget;
  if (!saved?.setupComplete || !budget) return defaultFinancialContext(profile, app);

  const today = new Date();
  const dailyBudget = Math.max(0, safeNumber(budget.monthlyIncome) / 30);
  const holdings = Array.isArray(budget.holdings) ? budget.holdings : [];
  const goals = Array.isArray(budget.goals) ? budget.goals : [];
  const expenseTransactions = Array.isArray(budget.transactions)
    ? budget.transactions.filter((transaction) => transaction.type === 'expense')
    : [];
  const todaySpent = expenseTransactions
    .filter((transaction) => sameDate(transaction.date, today))
    .reduce((sum, transaction) => sum + safeNumber(transaction.amount), 0);
  const totalPortfolioValue = holdings.reduce((sum, holding) => sum + safeNumber(holding.shares) * safeNumber(holding.currentPrice), 0);
  const totalPortfolioCost = holdings.reduce((sum, holding) => sum + safeNumber(holding.shares) * safeNumber(holding.avgCost), 0);

  return {
    dailyBudget,
    totalSpentToday: todaySpent,
    safeToSpend: Math.max(0, dailyBudget - todaySpent),
    streak: 0,
    spareChangeStash: 0,
    holdings: holdings.map((holding) => {
      const shares = safeNumber(holding.shares);
      const avgCost = safeNumber(holding.avgCost);
      const currentPrice = safeNumber(holding.currentPrice);
      return {
        name: holding.name,
        ticker: holding.ticker,
        shares,
        value: shares * currentPrice,
        plPct: avgCost > 0 ? ((currentPrice - avgCost) / avgCost) * 100 : 0,
      };
    }),
    totalPortfolioValue,
    totalPL: totalPortfolioValue - totalPortfolioCost,
    goals: goals.map((goal) => {
      const target = safeNumber(goal.target);
      const savedAmount = safeNumber(goal.saved);
      return {
        name: goal.name,
        target,
        saved: savedAmount,
        pct: target > 0 ? (savedAmount / target) * 100 : 0,
      };
    }),
    recentTransactions: expenseTransactions.slice(0, 8).map((transaction) => ({
      category: categoryLabel(budget, transaction.categoryId),
      amount: safeNumber(transaction.amount),
    })),
    app,
  };
}
