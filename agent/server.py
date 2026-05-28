from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import anthropic
from tools import get_current_stock_price, analyze_portfolio_risk

app = FastAPI(title="Coinly AI Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from environment

TOOLS = [
    {
        "name": "get_stock_price",
        "description": "Get the current price of a stock, ETF, or cryptocurrency asset.",
        "input_schema": {
            "type": "object",
            "properties": {
                "ticker": {
                    "type": "string",
                    "description": "The ticker symbol, e.g. AAPL, SPY, BTC, ETH."
                }
            },
            "required": ["ticker"]
        }
    },
    {
        "name": "analyze_portfolio_risk",
        "description": "Analyze the concentration risk of a portfolio based on largest holding.",
        "input_schema": {
            "type": "object",
            "properties": {
                "portfolio_value": {
                    "type": "number",
                    "description": "Total value of the portfolio in USD."
                },
                "largest_holding_value": {
                    "type": "number",
                    "description": "Value of the single largest holding in USD."
                }
            },
            "required": ["portfolio_value", "largest_holding_value"]
        }
    }
]


class ChatMessage(BaseModel):
    role: str
    content: str


class LearningContext(BaseModel):
    completed_lesson_count: int = 0
    total_xp: int = 0
    streak: int = 0
    active_lesson_title: Optional[str] = None
    active_game_title: Optional[str] = None
    mastery: Dict[str, Any] = {}
    recent_game_results: List[Dict[str, Any]] = []


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]
    financial_context: Dict[str, Any]
    learning_context: Optional[LearningContext] = None
    user_profile: Optional[Dict[str, Any]] = None


def _build_system_prompt(
    ctx: Dict[str, Any],
    learning: Optional[LearningContext],
    profile: Optional[Dict[str, Any]],
) -> str:
    profile_section = ""
    if profile:
        answers = profile.get("answers") or {}
        user = profile.get("user") or {}
        name = user.get("name", "")
        goals = ", ".join(answers.get("primaryGoal", [])) or "Not set"
        risk = ", ".join(answers.get("risk", [])) or "Balanced"
        style = ", ".join(answers.get("learningStyle", [])) or "Guided lessons"
        interests = ", ".join(answers.get("interests", [])) or "General finance"
        horizon = ", ".join(answers.get("timeHorizon", [])) or "Not set"
        profile_section = f"""
User Profile:
- Name: {name}
- Primary Goal: {goals}
- Risk Tolerance: {risk}
- Learning Style: {style}
- Interests: {interests}
- Time Horizon: {horizon}
"""

    learning_section = ""
    if learning:
        mastery_lines = []
        for competency, state in (learning.mastery or {}).items():
            if isinstance(state, dict):
                confidence = state.get("confidence", 0)
                mastery_lines.append(f"  - {competency}: {int(confidence * 100)}% confidence")
        mastery_str = "\n".join(mastery_lines) if mastery_lines else "  - No mastery data yet (keep encouraging them to start!)"

        game_lines = []
        for result in (learning.recent_game_results or [])[-3:]:
            game_id = result.get("gameId", "unknown game")
            performance = result.get("performance", 0)
            profit = result.get("profit", 0)
            game_lines.append(f"  - {game_id}: {performance:.0f}% performance, ${profit:.2f} profit")
        game_str = "\n".join(game_lines) if game_lines else "  - No games played yet"

        active_note = f"\n- Currently in lesson: \"{learning.active_lesson_title}\"" if learning.active_lesson_title else ""
        game_note = f"\n- Currently playing: \"{learning.active_game_title}\"" if learning.active_game_title else ""

        learning_section = f"""
Learning Progress:
- Lessons Completed: {learning.completed_lesson_count}
- Total XP: {learning.total_xp}
- Streak: {learning.streak} day(s){active_note}{game_note}
- Competency Mastery:
{mastery_str}
- Recent Games:
{game_str}
"""

    holdings = ctx.get("holdings") or []
    goals_list = ctx.get("goals") or []
    goal_str = ", ".join(
        [f"{g['name']} ({g.get('pct', 0):.0f}% funded)" for g in goals_list]
    ) if goals_list else "No goals set yet"
    recent_tx = ctx.get("recentTransactions") or []
    tx_str = ", ".join(
        [f"{t['category']} ${t['amount']:.2f}" for t in recent_tx[:4]]
    ) if recent_tx else "No recent transactions"

    return f"""You are Coinly AI, a financial education coach for the Coinly learning app.

Your role:
- Help users understand personal finance concepts grounded in their actual lesson progress
- Provide personalized coaching based on their competency mastery and recent activity
- Answer budgeting, investing, and goal questions using their real financial data
- Reference what they're currently learning when relevant (active lesson or game)
- Be encouraging, clear, and age-appropriate — users may be students or minors

Your strict guardrails:
- Stay focused on financial education and personal finance topics only
- Never give specific investment advice or tell users to buy or sell specific securities
- Do not provide medical, legal, or unrelated advice
- Never recommend taking on risky debt or speculative positions
- If asked something outside your scope, kindly redirect to financial learning
{profile_section}{learning_section}
Financial Snapshot:
- Daily Budget: ${ctx.get('dailyBudget', 0):.2f}
- Spent Today: ${ctx.get('totalSpentToday', 0):.2f}
- Safe to Spend: ${ctx.get('safeToSpend', 0):.2f}
- Portfolio Value: ${ctx.get('totalPortfolioValue', 0):.2f}
- Total P&L: ${ctx.get('totalPL', 0):.2f}
- Holdings: {len(holdings)} asset(s)
- Goals: {goal_str}
- Recent Transactions: {tx_str}
"""


def _call_tool(name: str, tool_input: Dict[str, Any]) -> str:
    if name == "get_stock_price":
        return get_current_stock_price(tool_input["ticker"])
    if name == "analyze_portfolio_risk":
        return analyze_portfolio_risk(
            tool_input["portfolio_value"],
            tool_input["largest_holding_value"],
        )
    return f"Unknown tool: {name}"


@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    system_prompt = _build_system_prompt(
        req.financial_context, req.learning_context, req.user_profile
    )

    messages: List[Dict[str, Any]] = []
    for msg in req.history:
        role = "user" if msg.role.lower() in ("user",) else "assistant"
        messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": req.message})

    # Agentic loop — handles tool calls until the model stops
    try:
        for _ in range(5):
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                system=system_prompt,
                messages=messages,
                tools=TOOLS,
            )

            if response.stop_reason == "end_turn":
                for block in response.content:
                    if block.type == "text":
                        return {"reply": block.text}
                return {"reply": "I'm here to help! What would you like to know?"}

            if response.stop_reason == "tool_use":
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        result = _call_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })

                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": tool_results})
                continue

            break

    except Exception as e:
        print(f"Anthropic API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {"reply": "I'm having trouble right now. Please try again in a moment."}
