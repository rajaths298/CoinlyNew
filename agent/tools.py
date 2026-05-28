import requests

# Fallback prices when live APIs are unavailable
_FALLBACK_PRICES: dict[str, float] = {
    "AAPL": 213.00,
    "SPY": 588.00,
    "BTC": 108000.00,
    "ETH": 2600.00,
    "MSFT": 457.00,
    "GOOGL": 178.00,
    "AMZN": 225.00,
    "TSLA": 352.00,
    "NVDA": 135.00,
    "QQQ": 518.00,
}

# CoinGecko IDs for crypto tickers
_COINGECKO_IDS: dict[str, str] = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "DOGE": "dogecoin",
    "ADA": "cardano",
    "XRP": "ripple",
    "AVAX": "avalanche-2",
    "MATIC": "matic-network",
    "DOT": "polkadot",
    "LINK": "chainlink",
}


def _fetch_crypto_price(ticker: str) -> float | None:
    coin_id = _COINGECKO_IDS.get(ticker.upper())
    if not coin_id:
        return None
    try:
        response = requests.get(
            "https://api.coingecko.com/api/v3/simple/price",
            params={"ids": coin_id, "vs_currencies": "usd"},
            timeout=5,
        )
        data = response.json()
        return data.get(coin_id, {}).get("usd")
    except Exception:
        return None


def _fetch_stock_price(ticker: str) -> float | None:
    try:
        url = f"https://stooq.com/q/l/?s={ticker.lower()}.us&f=sd2t2ohlcv&h&e=csv"
        response = requests.get(url, timeout=5)
        lines = response.text.strip().splitlines()
        if len(lines) < 2:
            return None
        # CSV columns: Symbol,Date,Time,Open,High,Low,Close,Volume
        parts = lines[1].split(",")
        if len(parts) >= 5:
            close = float(parts[6]) if len(parts) > 6 else float(parts[4])
            return close if close > 0 else None
    except Exception:
        return None
    return None


def get_current_stock_price(ticker: str) -> str:
    """Get the current market price for a stock, ETF, or cryptocurrency.

    Args:
        ticker: The ticker symbol, e.g. "AAPL", "SPY", "BTC", "ETH".
    """
    ticker = ticker.upper().strip()

    # Try crypto first
    if ticker in _COINGECKO_IDS:
        price = _fetch_crypto_price(ticker)
        if price is not None:
            return f"{ticker} is currently trading at ${price:,.2f} USD (live via CoinGecko)."

    # Try stock/ETF
    price = _fetch_stock_price(ticker)
    if price is not None:
        return f"{ticker} is currently trading at ${price:,.2f} USD (live via Stooq)."

    # Fall back to hardcoded reference price
    fallback = _FALLBACK_PRICES.get(ticker)
    if fallback is not None:
        return f"{ticker} is approximately ${fallback:,.2f} USD (reference price — live data unavailable)."

    return (
        f"I couldn't retrieve a live price for {ticker}. "
        "Please check a financial site like Yahoo Finance for the latest quote."
    )


def analyze_portfolio_risk(portfolio_value: float, largest_holding_value: float) -> str:
    """Analyze the concentration risk of a portfolio.

    Args:
        portfolio_value: Total value of the portfolio in USD.
        largest_holding_value: Value of the single largest holding in USD.
    """
    if portfolio_value <= 0:
        return "Portfolio is empty — no risk to analyze yet."

    concentration = (largest_holding_value / portfolio_value) * 100

    if concentration > 40:
        return (
            f"High concentration risk: your largest holding makes up {concentration:.1f}% of your portfolio. "
            "Consider diversifying across more assets to reduce single-asset exposure."
        )
    if concentration > 20:
        return (
            f"Moderate concentration: your largest holding is {concentration:.1f}% of your portfolio. "
            "This is manageable, but worth keeping an eye on as markets move."
        )
    return (
        f"Well-diversified: your largest holding is only {concentration:.1f}% of your portfolio. "
        "Good job spreading risk across multiple assets!"
    )
