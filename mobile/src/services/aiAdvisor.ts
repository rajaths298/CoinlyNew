export type FinancialContext = {
  dailyBudget: number;
  totalSpentToday: number;
  safeToSpend: number;
  streak: number;
  spareChangeStash: number;
  holdings: { name: string; ticker: string; shares: number; value: number; plPct: number }[];
  totalPortfolioValue: number;
  totalPL: number;
  goals: { name: string; target: number; saved: number; pct: number }[];
  recentTransactions: { category: string; amount: number }[];
  app?: Record<string, unknown>;
};

export type LearningContext = {
  completed_lesson_count: number;
  total_xp: number;
  streak: number;
  active_lesson_title?: string;
  active_game_title?: string;
  mastery?: Record<string, unknown>;
  recent_game_results?: Array<Record<string, unknown>>;
};

export type ChatHistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function askCoinlyAI(
  userMessage: string,
  history: ChatHistoryMessage[],
  ctx: FinancialContext,
  learningCtx?: LearningContext,
  userProfile?: Record<string, unknown>,
): Promise<string> {
  const body = {
    message: userMessage,
    history: history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
    financial_context: ctx,
    learning_context: learningCtx ?? null,
    user_profile: userProfile ?? null,
  };

  try {
    // Note: If running on a physical device, replace localhost with your Mac's local IP address.
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Coinly AI API error:', errorText);
      throw new Error(`Agent returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error in askCoinlyAI:', error);
    throw error;
  }
}

export function getCoinlyAiConnectionHelp(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.length > 0
    ? `Coinly AI couldn't connect: ${message}`
    : 'Coinly AI hit a hiccup. Make sure the backend is running and try again.';
}
