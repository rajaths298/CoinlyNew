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
  review_queue_count?: number;
  last_studied_at?: string;
  recent_lesson_attempts?: Array<Record<string, unknown>>;
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
  const ollamaUrl = 'http://localhost:11434/api/chat';
<<<<<<< Updated upstream

=======
  
>>>>>>> Stashed changes
  const systemMessage = `You are Coinly AI, a friendly and extremely smart financial assistant. Keep responses concise, engaging, and mobile-friendly. You help users manage their budget, analyze their spending, understand market investments, and learn financial concepts. Provide actionable, supportive advice.

=== CURRENT USER CONTEXT ===
Financial Context: ${JSON.stringify(ctx)}
Learning Context: ${JSON.stringify(learningCtx || {})}
User Profile: ${JSON.stringify(userProfile || {})}
========================`;

  const messages = [
    { role: 'system', content: systemMessage },
    ...history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        messages: messages,
        stream: false,
      }),
    });

    if (!response.ok) {
       throw new Error(`Ollama returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('Error connecting to local Ollama AI:', error);
    throw error;
  }
}

export async function askExerciseExplanation(
  exerciseContext: string,
  timeoutMs = 8000,
): Promise<string> {
  const ollamaUrl = 'http://localhost:11434/api/chat';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const systemPrompt =
    'You are a friendly finance tutor embedded in a mobile learning app. ' +
    'In 2-3 conversational sentences, explain the exercise answer described below using a concrete everyday example. ' +
    'Be warm and clear. No jargon, no bullet lists, no bold text.';

  try {
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: exerciseContext },
        ],
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json();
    return data.message.content as string;
  } finally {
    clearTimeout(timer);
  }
}

export function getCoinlyAiConnectionHelp(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.length > 0
    ? `Local AI couldn't connect: ${message}. Make sure Ollama is running!`
    : 'Local AI hit a hiccup. Make sure Ollama is running on your Mac.';
}
