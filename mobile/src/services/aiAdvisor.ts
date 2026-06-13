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

// Configurable so the same code works in dev (local Ollama) and in production
// (a hosted endpoint). Set EXPO_PUBLIC_COINLY_AI_URL to your deployed model.
const AI_BASE_URL = (process.env.EXPO_PUBLIC_COINLY_AI_URL ?? 'http://localhost:11434').replace(/\/$/, '');
const AI_CHAT_URL = `${AI_BASE_URL}/api/chat`;
const AI_MODEL = process.env.EXPO_PUBLIC_COINLY_AI_MODEL ?? 'llama3.1:8b';

// Tuned for speed + concise replies. keep_alive holds the model warm so the
// second message onward doesn't pay the cold-start "thinking" delay.
const PERF_OPTIONS = {
  num_predict: 300, // cap length -> faster, shorter answers
  temperature: 0.5,
  top_p: 0.9,
};
const KEEP_ALIVE = '30m';

function buildSystemMessage(
  ctx: FinancialContext,
  learningCtx?: LearningContext,
  userProfile?: Record<string, unknown>,
): string {
  return `You are Coinly AI, a fast, friendly money assistant inside the Coinly app.

How to answer:
- Be concise. Default to 1-3 short sentences; keep replies under ~60 words unless the user asks for more detail.
- Plain, simple language. Get straight to the point. Don't over-explain or add long disclaimers.
- Warm, encouraging, never preachy.
- Ask a follow-up question only when you genuinely cannot help without it.
- You specialize in money (budgeting, saving, investing basics, goals) but also help with school, career, and general questions. Default to a finance angle unless the user clearly asks about something else.
- Keep it educational; don't present guesses as guaranteed financial, legal, or tax advice.
- Use the context below to personalize, but don't read the raw data back to the user.

=== CURRENT USER CONTEXT ===
Financial Context: ${JSON.stringify(ctx)}
Learning Context: ${JSON.stringify(learningCtx || {})}
User Profile: ${JSON.stringify(userProfile || {})}
========================`;
}

function buildMessages(
  userMessage: string,
  history: ChatHistoryMessage[],
  ctx: FinancialContext,
  learningCtx?: LearningContext,
  userProfile?: Record<string, unknown>,
) {
  return [
    { role: 'system', content: buildSystemMessage(ctx, learningCtx, userProfile) },
    ...history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];
}

export async function askCoinlyAI(
  userMessage: string,
  history: ChatHistoryMessage[],
  ctx: FinancialContext,
  learningCtx?: LearningContext,
  userProfile?: Record<string, unknown>,
): Promise<string> {
  try {
    const response = await fetch(AI_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: buildMessages(userMessage, history, ctx, learningCtx, userProfile),
        stream: false,
        options: PERF_OPTIONS,
        keep_alive: KEEP_ALIVE,
      }),
    });

    if (!response.ok) {
      throw new Error(`Coinly AI returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('Error connecting to Coinly AI:', error);
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

/**
 * Streaming variant: invokes onToken with the full text-so-far as each chunk
 * arrives, so the UI can render the reply live. Resolves with the final text.
 * Uses XMLHttpRequest because React Native's fetch does not expose a readable
 * response stream; XHR onprogress delivers partial responseText reliably on
 * iOS, Android, and web. Falls back gracefully (single update) if a platform
 * only delivers the body at the end.
 */
export function streamCoinlyAI(
  userMessage: string,
  history: ChatHistoryMessage[],
  ctx: FinancialContext,
  learningCtx: LearningContext | undefined,
  userProfile: Record<string, unknown> | undefined,
  onToken: (fullText: string) => void,
): Promise<string> {
  const body = JSON.stringify({
    model: AI_MODEL,
    messages: buildMessages(userMessage, history, ctx, learningCtx, userProfile),
    stream: true,
    options: PERF_OPTIONS,
    keep_alive: KEEP_ALIVE,
  });

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', AI_CHAT_URL);
    xhr.setRequestHeader('Content-Type', 'application/json');

    let processed = 0;
    let full = '';

    const drain = () => {
      const text = xhr.responseText;
      let newlineIdx: number;
      while ((newlineIdx = text.indexOf('\n', processed)) !== -1) {
        const line = text.slice(processed, newlineIdx).trim();
        processed = newlineIdx + 1;
        if (!line) continue;
        try {
          const chunk = JSON.parse(line);
          const piece = chunk?.message?.content ?? '';
          if (piece) {
            full += piece;
            onToken(full);
          }
        } catch {
          // partial / non-JSON line: ignore, it'll be re-read once complete
        }
      }
    };

    xhr.onprogress = drain;
    xhr.onload = () => {
      drain();
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(full);
      } else {
        reject(new Error(`Coinly AI returned ${xhr.status}: ${xhr.responseText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error connecting to Coinly AI'));
    xhr.ontimeout = () => reject(new Error('Coinly AI timed out'));

    xhr.send(body);
  });
}

export function getCoinlyAiConnectionHelp(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.length > 0
    ? `Coinly AI couldn't connect: ${message}. Please try again in a moment.`
    : "Coinly AI hit a hiccup. Please try again in a moment.";
}
