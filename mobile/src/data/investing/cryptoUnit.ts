/**
 * Unit 5 — Crypto
 * Unlocks crypto trading (featureUnlocks key: 'crypto')
 * Unit ID: unit-crypto-10
 * Lesson IDs: inv5-l1 through inv5-l4 + inv5-practice
 */
import type { Lesson } from '../../types/lesson';
import type { Exercise, GuidebookEntry, PathUnit } from '../../types/learn';

function makeLesson(id: string, title: string, exercises: Exercise[], xp: number): Lesson {
  return {
    id, title,
    domain: 'investing', level: 'confident',
    unitId: 'unit-crypto-10', unitTitle: 'Crypto',
    courseTrackId: 'investing', moduleId: 'investing-crypto',
    durationMinutes: Math.max(4, Math.round(exercises.length * 1.3)),
    xp, prerequisites: [], difficulty: 3, learningObjectives: [`Understand and apply: ${title}.`],
    competencyIds: ['riskReturn', 'portfolioConstruction'],
    competencyTags: ['crypto', 'blockchain', 'investing', 'digital-assets'],
    masteryWeight: 1, formulaRefs: [], misconceptions: [], steps: [], exercises,
  };
}

const ZIG: Array<'left' | 'center' | 'right'> = [
  'center', 'right', 'left', 'center', 'center', 'right', 'left', 'center',
];

// ─── Lesson 1: What is Crypto? ───────────────────────────────────────────────

const l1Exercises: Exercise[] = [
  {
    id: 'inv5-l1-e1',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Starting from first principles surfaces misconceptions about what crypto actually is.',
    prompt: 'You\'ve heard Bitcoin called "digital gold," "fake money," and "the future of finance." What do you actually think crypto is — and what problem was it originally designed to solve?',
    conceptReveal: 'Bitcoin (2009) was designed to enable peer-to-peer digital payments without trusting any bank or government — a permissionless, censorship-resistant store of value. It runs on a blockchain: a public ledger copied across thousands of computers, secured by cryptography. No single entity controls it. Ethereum extended the idea: programmable money with "smart contracts" that execute automatically. Crypto is a new asset class — one without a central issuer, governed by math and consensus.',
    checkpoints: [
      'Bitcoin was created to enable trustless, peer-to-peer value transfer without intermediaries',
      'A blockchain is a distributed ledger secured by cryptography and maintained by consensus',
      'Ethereum introduced programmable smart contracts, extending crypto beyond payments',
    ],
  },
  {
    id: 'inv5-l1-e2',
    kind: 'matchPairs',
    competencyId: 'riskReturn',
    rationale: 'Core vocabulary is the foundation for understanding all crypto discussion.',
    instruction: 'Match each crypto term to its definition:',
    pairs: [
      { id: 'p1', term: 'Blockchain', definition: 'A distributed, immutable ledger of transactions secured by cryptography' },
      { id: 'p2', term: 'Wallet', definition: 'Software holding your private keys — not the coins themselves' },
      { id: 'p3', term: 'Private Key', definition: 'A secret number that proves ownership and authorizes transactions' },
      { id: 'p4', term: 'Smart Contract', definition: 'Self-executing code on Ethereum that runs automatically when conditions are met' },
    ],
  },
  {
    id: 'inv5-l1-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'The "not your keys, not your coins" principle is the most important security concept in crypto.',
    prompt: 'Your friend stores all their Bitcoin on a centralized exchange like Coinbase. What risk does this carry that holding in a personal wallet does not?',
    options: [
      { id: 'a', text: 'The exchange can charge higher fees for long-term storage', isCorrect: false },
      { id: 'b', text: 'If the exchange is hacked or goes bankrupt, your crypto may be lost', isCorrect: true },
      { id: 'c', text: 'Exchange-held Bitcoin earns less appreciation than self-custodied Bitcoin', isCorrect: false },
      { id: 'd', text: 'There is no meaningful difference — exchanges are just as safe as personal wallets', isCorrect: false },
    ],
  },
  {
    id: 'inv5-l1-e4',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Separating layer-1 blockchains from tokens/applications clarifies the ecosystem hierarchy.',
    instruction: 'Sort each into Layer-1 Blockchain or Token / Application:',
    buckets: [
      { id: 'l1', label: 'Layer-1 Blockchain' },
      { id: 'token', label: 'Token / Application' },
    ],
    items: [
      { id: 'i1', text: 'Bitcoin (BTC)', bucketId: 'l1' },
      { id: 'i2', text: 'Ethereum (ETH)', bucketId: 'l1' },
      { id: 'i3', text: 'Uniswap (UNI) — a DEX protocol token on Ethereum', bucketId: 'token' },
      { id: 'i4', text: 'Solana (SOL)', bucketId: 'l1' },
      { id: 'i5', text: 'USD Coin (USDC) — a stablecoin on multiple chains', bucketId: 'token' },
    ],
  },
  {
    id: 'inv5-l1-e5',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'Correcting the common misconception that blockchain = Bitcoin is essential vocabulary-building.',
    statement: 'Bitcoin and blockchain are the same thing — blockchain is just another name for Bitcoin.',
    isTrue: false,
  },
  {
    id: 'inv5-l1-e6',
    kind: 'tapToOrder',
    competencyId: 'riskReturn',
    rationale: 'Understanding the transaction lifecycle makes blockchain\'s "trustless" nature concrete.',
    instruction: 'Put a Bitcoin transaction in the correct order from initiation to confirmation:',
    items: [
      { id: 's1', text: 'You sign a transaction with your private key and broadcast it to the network', rank: 1 },
      { id: 's2', text: 'Miners/validators pick up the transaction from the mempool (queue)', rank: 2 },
      { id: 's3', text: 'Transaction is bundled into a block with other pending transactions', rank: 3 },
      { id: 's4', text: 'Block is secured by proof-of-work or proof-of-stake and added to the chain', rank: 4 },
      { id: 's5', text: 'After 6 confirmations (~1 hour for Bitcoin), the transaction is considered final', rank: 5 },
    ],
  },
];

// ─── Lesson 2: Bitcoin vs Altcoins ───────────────────────────────────────────

const l2Exercises: Exercise[] = [
  {
    id: 'inv5-l2-e1',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Prompting the learner to differentiate Bitcoin from "other crypto" builds a more nuanced mental model.',
    prompt: 'There are thousands of cryptocurrencies. Are they all created equal? What might make Bitcoin different from a random new altcoin?',
    conceptReveal: 'Bitcoin has properties no other crypto fully replicates: 21 million hard cap (known final supply), 15+ years of unbroken security, widest adoption as a store of value, and the highest hash rate / security spend of any blockchain. Altcoins trade off some of Bitcoin\'s properties for functionality — Ethereum for programmability, Solana for speed, stablecoins for price stability. But most altcoins are speculative bets on teams and roadmaps, not established stores of value. The risk profile differs dramatically.',
    checkpoints: [
      'Bitcoin has a verifiable, immutable 21M supply cap and the longest security track record',
      'Altcoins offer different trade-offs (speed, programmability, yield) but typically have higher risk',
      'Most altcoins are speculative; treat them very differently from BTC/ETH in portfolio sizing',
    ],
  },
  {
    id: 'inv5-l2-e2',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Understanding stablecoins is critical for grasping DeFi and crypto risk management.',
    prompt: 'A "stablecoin" like USDC is designed to:',
    options: [
      { id: 'a', text: 'Gain value faster than Bitcoin by being backed by tech companies', isCorrect: false },
      { id: 'b', text: 'Maintain a fixed value (usually $1) by holding reserves of real dollars or assets', isCorrect: true },
      { id: 'c', text: 'Replace fiat currencies by eliminating the need for government backing', isCorrect: false },
      { id: 'd', text: 'Earn a guaranteed 10% annual yield for holders', isCorrect: false },
    ],
  },
  {
    id: 'inv5-l2-e3',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Classifying crypto types by their primary use case prevents conflating very different assets.',
    instruction: 'Sort each crypto asset into its primary category:',
    buckets: [
      { id: 'sv', label: 'Store of Value' },
      { id: 'smart', label: 'Smart Contract Platform' },
      { id: 'stable', label: 'Stablecoin' },
      { id: 'defi', label: 'DeFi / Application Token' },
    ],
    items: [
      { id: 'i1', text: 'Bitcoin (BTC)', bucketId: 'sv' },
      { id: 'i2', text: 'Ethereum (ETH)', bucketId: 'smart' },
      { id: 'i3', text: 'USD Coin (USDC)', bucketId: 'stable' },
      { id: 'i4', text: 'Aave (AAVE) — a lending protocol token', bucketId: 'defi' },
      { id: 'i5', text: 'Solana (SOL)', bucketId: 'smart' },
    ],
  },
  {
    id: 'inv5-l2-e4',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'The collapse of TerraUSD/LUNA shows that not all stablecoins carry the same risk.',
    statement: 'All stablecoins are equally safe — they all maintain their $1 peg without risk.',
    isTrue: false,
  },
  {
    id: 'inv5-l2-e5',
    kind: 'fillBlank',
    competencyId: 'riskReturn',
    rationale: 'Halving mechanics are key to Bitcoin\'s supply schedule and its investment narrative.',
    template: 'Bitcoin\'s supply is capped at ___ million coins. Approximately every four years, the block reward paid to miners is cut in half — an event called the ___.',
    blanks: ['21', 'halving'],
    wordBank: ['21', '100', 'halving', 'fork', 'split', 'mining'],
  },
  {
    id: 'inv5-l2-e6',
    kind: 'scenarioDecision',
    competencyId: 'riskReturn',
    rationale: 'A portfolio allocation scenario makes the risk-tier distinction actionable.',
    story: 'Taylor has $5,000 to invest in crypto. They\'re considering: (A) 100% into a newly launched "DeFi 3.0" altcoin with 10,000% APY promises, (B) 80% Bitcoin / 20% Ethereum, or (C) 60% BTC / 20% ETH / 20% random altcoins.',
    choices: [
      { id: 'a', text: 'Option A — extremely high APY means the highest long-term return', outcome: '10,000% APY is almost always unsustainable and predatory. These "yields" typically collapse within months, wiping out principal. This is among the riskiest crypto strategies.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Option B — Bitcoin and Ethereum provide exposure to the highest-conviction crypto assets', outcome: 'For a beginner with $5,000 entering crypto, concentrating in Bitcoin and Ethereum gives real exposure without speculative tail-risk. This is the most reasonable starting allocation.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Option C — diversifying into altcoins reduces risk by spreading across more assets', outcome: 'Adding random altcoins doesn\'t reduce risk when those altcoins are highly correlated to BTC/ETH during downturns — and often fall further. Diversification within crypto provides less protection than across asset classes.', isCorrect: false, score: 1 },
    ],
  },
];

// ─── Lesson 3: Crypto as an Asset Class ─────────────────────────────────────

const l3Exercises: Exercise[] = [
  {
    id: 'inv5-l3-e1',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Asking the learner to position crypto within a traditional portfolio surfaces the key questions about correlation and sizing.',
    prompt: 'If you already own stocks and bonds, why might you add a small allocation to Bitcoin? And why might you keep it small — say 5% or less?',
    conceptReveal: 'Bitcoin has historically had low long-term correlation to stocks and bonds, offering potential diversification. In past cycles, it also delivered outsized returns. However, crypto is highly volatile (50-80% drawdowns are common), is sensitive to regulatory risk, and has no underlying cash flows to anchor valuation. A small allocation (1-5%) can improve portfolio Sharpe ratio during bull cycles without catastrophic impact during crypto bear markets. A large allocation turns your whole portfolio into a crypto bet.',
    checkpoints: [
      'Crypto\'s historically low correlation to traditional assets may improve portfolio diversification',
      '50-80% drawdowns are normal in crypto — size accordingly',
      'No cash flows, intrinsic value from network adoption alone — valuation is narrative-driven',
    ],
  },
  {
    id: 'inv5-l3-e2',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'During market crises, crypto has sometimes correlated heavily with equities — debunking the "always uncorrelated" narrative.',
    statement: 'Bitcoin always moves independently of the stock market, making it a perfect hedge during market crashes.',
    isTrue: false,
  },
  {
    id: 'inv5-l3-e3',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Dollar-cost averaging (DCA) is the most practical entry strategy for volatile assets like crypto.',
    prompt: 'For a long-term investor wanting crypto exposure, which strategy best manages volatility risk?',
    options: [
      { id: 'a', text: 'Lump-sum invest the full allocation at once to capture the best entry price', isCorrect: false },
      { id: 'b', text: 'Dollar-cost average (buy a fixed amount weekly or monthly regardless of price)', isCorrect: true },
      { id: 'c', text: 'Wait for the price to drop 50% before buying — always buy the dip', isCorrect: false },
      { id: 'd', text: 'Only buy when the Fear & Greed Index shows extreme greed', isCorrect: false },
    ],
  },
  {
    id: 'inv5-l3-e4',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'Calculating a portfolio impact number turns abstract volatility into a concrete risk.',
    template: 'If you hold 5% of your portfolio in Bitcoin and Bitcoin drops 60%, your total portfolio loss from that position alone is ___%. Meanwhile, a 60% drop in a 20% crypto allocation would cost ___% of total portfolio value.',
    blanks: ['3', '12'],
    wordBank: ['3', '5', '10', '12', '20', '25'],
  },
  {
    id: 'inv5-l3-e5',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Distinguishing crypto-specific risks from market risks sharpens due diligence.',
    instruction: 'Sort these risks into Crypto-Specific or General Market Risk:',
    buckets: [
      { id: 'crypto', label: 'Crypto-Specific' },
      { id: 'market', label: 'General Market Risk' },
    ],
    items: [
      { id: 'i1', text: 'Government bans or restricts crypto trading', bucketId: 'crypto' },
      { id: 'i2', text: 'Federal Reserve raises interest rates sharply', bucketId: 'market' },
      { id: 'i3', text: 'A critical bug is found in Ethereum\'s smart contract layer', bucketId: 'crypto' },
      { id: 'i4', text: 'Global recession reduces risk appetite for all assets', bucketId: 'market' },
      { id: 'i5', text: 'A major exchange is hacked, causing panic selling', bucketId: 'crypto' },
    ],
  },
  {
    id: 'inv5-l3-e6',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'Crypto market cycle vocabulary (bull/bear/halving/capitulation) is used constantly in crypto discussion.',
    instruction: 'Match each crypto market term to its description:',
    pairs: [
      { id: 'p1', term: 'Bull Market', definition: 'Sustained price increases of 20%+ driven by growing adoption and sentiment' },
      { id: 'p2', term: 'Capitulation', definition: 'Panic selling by remaining holders, often marking a market bottom' },
      { id: 'p3', term: 'Halving Cycle', definition: '~4-year rhythm tied to Bitcoin\'s block reward being cut in half' },
      { id: 'p4', term: 'Altcoin Season', definition: 'Period when smaller cryptos outperform Bitcoin after BTC rallies' },
    ],
  },
];

// ─── Practice ─────────────────────────────────────────────────────────────────

const l4PracticeExercises: Exercise[] = [
  {
    id: 'inv5-p-e1',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Proof-of-work vs proof-of-stake is fundamental infrastructure vocabulary.',
    prompt: 'Ethereum switched from proof-of-work to proof-of-stake in "The Merge" (2022). The main practical difference is:',
    options: [
      { id: 'a', text: 'Proof-of-stake requires massive electricity use; proof-of-work is energy-efficient', isCorrect: false },
      { id: 'b', text: 'Proof-of-stake replaces mining with validators who lock up (stake) ETH as collateral', isCorrect: true },
      { id: 'c', text: 'Proof-of-stake eliminated transaction fees completely', isCorrect: false },
      { id: 'd', text: 'Proof-of-work made Ethereum more centralized; proof-of-stake made it fully decentralized', isCorrect: false },
    ],
  },
  {
    id: 'inv5-p-e2',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'Crypto gains are taxable — a detail many beginners learn the hard way.',
    statement: 'In most countries (including the US), selling cryptocurrency at a profit is not a taxable event.',
    isTrue: false,
  },
  {
    id: 'inv5-p-e3',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Distinguishing hot vs cold storage is a critical security decision every crypto holder faces.',
    instruction: 'Sort each storage option into Hot Wallet (internet-connected) or Cold Wallet (offline):',
    buckets: [
      { id: 'hot', label: 'Hot Wallet' },
      { id: 'cold', label: 'Cold Wallet' },
    ],
    items: [
      { id: 'i1', text: 'Ledger Nano hardware wallet stored in a safe', bucketId: 'cold' },
      { id: 'i2', text: 'MetaMask browser extension on your laptop', bucketId: 'hot' },
      { id: 'i3', text: 'Coinbase mobile app wallet', bucketId: 'hot' },
      { id: 'i4', text: 'A paper wallet (printed private key) locked away offline', bucketId: 'cold' },
    ],
  },
  {
    id: 'inv5-p-e4',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'A personal positioning question integrates everything learned about crypto into a practical framework.',
    prompt: 'Given what you\'ve learned, how would you explain to a skeptical friend why crypto might deserve even a small place in a diversified portfolio — and what you\'d tell them to be careful about?',
    conceptReveal: 'For: historically low correlation to stocks/bonds, asymmetric return potential in early innings of global adoption, and exposure to a genuinely new technology layer (programmable money). Against (and what to be careful about): extreme volatility, no cash flows or earnings to anchor value, regulatory and custody risk, and the high failure rate of altcoins. The bull case is portfolio-level: a 3-5% position can meaningfully improve returns if crypto succeeds, while a drawdown has limited impact on the total portfolio.',
    checkpoints: [
      'Small allocation = asymmetric upside with manageable downside impact',
      'Volatility is real — 60-80% drawdowns happen regularly even in bull markets long-term',
      'Custody matters: self-custody reduces exchange risk but introduces key management risk',
    ],
  },
];

// ─── Lesson 4 (Capstone) ──────────────────────────────────────────────────────

const l5Exercises: Exercise[] = [
  {
    id: 'inv5-l4-e1',
    kind: 'miniStory',
    competencyId: 'riskReturn',
    rationale: 'A FOMO-driven trade narrative makes the behavioral risks of crypto visceral.',
    panels: [
      { text: 'SHIB is up 400% this week — I\'m putting my emergency fund in. This could be life-changing.', speaker: 'Jordan' },
      { text: 'That\'s your emergency fund. If it drops 90% — which meme coins often do — what\'s your plan?', speaker: 'Sam' },
      { text: 'I\'ll just sell if it drops a little. These things always recover.', speaker: 'Jordan' },
      { text: 'Meme coins often crash 80-99% and don\'t recover. And you\'re not thinking clearly right now.', speaker: 'Sam' },
    ],
    choicePrompt: 'What is the most important lesson from Jordan\'s decision?',
    choices: [
      { id: 'a', text: 'Jordan should have done more research on SHIB\'s technology first', isCorrect: false, outcome: 'The core problem wasn\'t missing technical research — it was using emergency funds for speculation and making a decision driven by FOMO rather than a strategy.' },
      { id: 'b', text: 'Emergency funds should never be used for speculative investments, and FOMO is the most reliable signal to pause', isCorrect: true, outcome: 'Exactly. Emergency funds must remain liquid and stable. FOMO (the fear of missing out) is consistently one of the worst signals to trade on — prices that feel urgently high are often already near the top.' },
      { id: 'c', text: 'The only mistake was the position size — 50% of the emergency fund would have been fine', isCorrect: false, outcome: 'No portion of emergency savings should be in speculative assets. The principle is categorical: emergency = liquid, stable, guaranteed.' },
    ],
  },
  {
    id: 'inv5-l4-e2',
    kind: 'calculator',
    competencyId: 'portfolioConstruction',
    rationale: 'Calculating unrealized gain from a DCA position makes the return on systematic investing concrete.',
    formulaKey: 'portfolioReturn',
    prompt: 'You\'ve been DCA-ing $200/month into Bitcoin for 12 months. Your average cost basis is $42,000/BTC. Bitcoin is now at $60,000. Calculate your approximate unrealized gain.',
    targetLabel: 'Unrealized Gain ($)',
    explanation: 'Unrealized Gain = Current Value − Total Cost. Adjust the sliders to see how current price affects your position.',
    inputs: [
      { id: 'totalInvested', label: 'Total Invested ($)', value: 2400, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'currentValue', label: 'Current Value ($)', value: 3429, min: 0, max: 20000, step: 50, prefix: '$' },
    ],
  },
  {
    id: 'inv5-l4-e3',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'Structuring a due diligence process for a new crypto investment prevents impulsive decisions.',
    instruction: 'Put these crypto due diligence steps in the right order:',
    items: [
      { id: 's1', text: 'Read the whitepaper or project documentation to understand what it actually does', rank: 1 },
      { id: 's2', text: 'Identify the team — are they public, credentialed, and accountable?', rank: 2 },
      { id: 's3', text: 'Analyze tokenomics — supply schedule, unlock events, and who holds large positions', rank: 3 },
      { id: 's4', text: 'Check liquidity — can you sell this without moving the market?', rank: 4 },
      { id: 's5', text: 'Size the position according to your risk tolerance — high-risk altcoins belong in the < 2% tier', rank: 5 },
    ],
  },
  {
    id: 'inv5-l4-e4',
    kind: 'scenarioDecision',
    competencyId: 'portfolioConstruction',
    rationale: 'Applying all crypto knowledge to a portfolio review tests integrated understanding.',
    story: 'Maya, 28 years old, has a $30,000 portfolio: 70% index funds, 20% individual stocks, 10% Bitcoin. She\'s considering adding a 10% Ethereum position and a 5% spread across 5 small altcoins.',
    choices: [
      { id: 'a', text: 'Add ETH and the altcoins — diversifying within crypto is always safer than concentration', outcome: 'Adding both would push crypto to 25% of her portfolio. Crypto diversification provides less protection than cross-asset-class diversification, since most altcoins correlate heavily with BTC/ETH during downturns.', isCorrect: false, score: 1 },
      { id: 'b', text: 'Add ETH but skip the altcoins — ETH has a clearer value thesis and the altcoins add mostly speculative risk', outcome: 'Reasonable approach. Adding ETH brings crypto to ~20%, which is high but defensible for a young investor with high risk tolerance. Skipping speculative altcoins removes the tail-risk of a near-zero outcome.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Reduce Bitcoin first — she already has too much in stocks, and Bitcoin is just as risky', outcome: 'Her stock-to-bond ratio is fine for 28. Bitcoin\'s volatility differs from index funds, but reducing it before adding even riskier altcoins is the wrong order of operations.', isCorrect: false, score: 0 },
    ],
  },
  {
    id: 'inv5-l4-e5',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Understanding DeFi at a high level is increasingly necessary for crypto literacy.',
    prompt: 'Decentralized Finance (DeFi) primarily refers to:',
    options: [
      { id: 'a', text: 'Crypto exchanges that accept fiat currency (dollars) for trading', isCorrect: false },
      { id: 'b', text: 'Financial services (lending, trading, yield) built on blockchains, operating without centralized intermediaries', isCorrect: true },
      { id: 'c', text: 'Government-issued digital currencies (CBDCs) that bypass commercial banks', isCorrect: false },
      { id: 'd', text: 'Any crypto with a team based outside of a major financial center', isCorrect: false },
    ],
  },
  {
    id: 'inv5-l4-e6',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'The final synthesis question integrates technical, behavioral, and portfolio knowledge into a personal investing framework.',
    prompt: 'You\'re now ready to trade crypto on Coinly. Before your first trade, what three things will you decide in advance — and why is having a pre-commitment important in a volatile market?',
    conceptReveal: 'Before entering any crypto position: (1) Maximum allocation — what % of your portfolio are you willing to risk in crypto? (2) Exit criteria — at what price or event will you take profits, cut losses, or rebalance? (3) Custody plan — will you hold on exchange (convenient, custodial risk) or self-custody (more secure, key management responsibility)? Pre-commitment matters because crypto markets run 24/7 and emotional volatility matches price volatility. Having rules set before you\'re emotional is the difference between a strategy and gambling.',
    checkpoints: [
      'Decide max allocation, exit criteria, and custody plan before your first trade',
      'Pre-commitment rules prevent emotion-driven decisions in a 24/7 volatile market',
      'Both exchange custody and self-custody have real trade-offs — choose consciously',
    ],
  },
];

// ─── Exports ──────────────────────────────────────────────────────────────────

export const cryptoUnitGuidebook: GuidebookEntry[] = [
  {
    id: 'guide-crypto-1',
    title: 'Crypto Ecosystem at a Glance',
    body: '• Layer-1 Blockchains (Bitcoin, Ethereum, Solana): the base infrastructure.\n• Smart Contract Platforms (Ethereum, Solana): programmable blockchains.\n• Stablecoins (USDC, USDT): pegged to fiat, useful for trading and DeFi.\n• DeFi Tokens (Aave, Uniswap): governance/utility tokens for on-chain protocols.\n• Meme Coins: typically no utility; highly speculative; frequent near-zero outcomes.',
  },
  {
    id: 'guide-crypto-2',
    title: 'Bitcoin Supply and the Halving',
    body: 'Bitcoin has a hard supply cap of 21 million coins — no central bank can create more. Approximately every 4 years (every 210,000 blocks), the block reward for miners is cut in half. This "halving" reduces new BTC entering the market. Historical halvings (2012, 2016, 2020) have preceded major bull markets, though past patterns don\'t guarantee future results.',
  },
  {
    id: 'guide-crypto-3',
    title: 'Custody: Hot vs Cold Wallets',
    body: 'Hot Wallets: internet-connected (exchange accounts, MetaMask). Convenient but exposed to hacks.\nCold Wallets: offline hardware (Ledger, Trezor) or paper wallets. Secure but require careful key management.\n\n"Not your keys, not your coins." If an exchange holds your private keys, you trust them completely. Self-custody gives control but is unforgiving — lose the seed phrase, lose the crypto permanently.',
  },
  {
    id: 'guide-crypto-4',
    title: 'Crypto Portfolio Sizing Framework',
    body: 'Recommended tiers by conviction and risk tolerance:\n• Conservative: 1-3% crypto (BTC/ETH only)\n• Moderate: 3-7% crypto (BTC + ETH + 1-2 established altcoins)\n• Aggressive: 7-15% crypto (BTC + ETH + diversified altcoins)\n• Speculative: >15% — concentrated crypto bet, not a balanced portfolio\n\nAlways keep emergency fund and near-term savings in stable, liquid assets.',
  },
  {
    id: 'guide-crypto-5',
    title: 'Crypto Tax Basics (US)',
    body: 'In the US, the IRS treats crypto as property:\n• Selling crypto is a taxable event (capital gain/loss)\n• Short-term gains (<1 year held): taxed as ordinary income\n• Long-term gains (>1 year held): taxed at preferential 0/15/20% rates\n• Trading one crypto for another is also taxable\n• Losses can offset gains ("tax-loss harvesting")\n\nConsult a tax professional for crypto-specific guidance.',
  },
];

export const cryptoUnitLessons: Record<string, Lesson> = {
  'inv5-l1': makeLesson('inv5-l1', 'What is Crypto?', l1Exercises, 65),
  'inv5-l2': makeLesson('inv5-l2', 'Bitcoin vs Altcoins', l2Exercises, 70),
  'inv5-l3': makeLesson('inv5-l3', 'Crypto as an Asset Class', l3Exercises, 75),
  'inv5-practice': makeLesson('inv5-practice', 'Practice Round', l4PracticeExercises, 50),
  'inv5-l4': makeLesson('inv5-l4', 'Crypto Capstone', l5Exercises, 100),
};

export const cryptoUnit: PathUnit = {
  id: 'unit-crypto-10',
  title: 'Crypto',
  subtitle: 'Understand digital assets before you hold them',
  color: '#F7931A',
  icon: '₿',
  trackId: 'crypto',
  competencyIds: ['riskReturn', 'portfolioConstruction'],
  nodes: [
    { id: 'inv5-l1-node',       type: 'lesson',   position: ZIG[0]!, lessonId: 'inv5-l1' },
    { id: 'inv5-l2-node',       type: 'lesson',   position: ZIG[1]!, lessonId: 'inv5-l2' },
    { id: 'inv5-l3-node',       type: 'lesson',   position: ZIG[2]!, lessonId: 'inv5-l3' },
    { id: 'inv5-practice-node', type: 'practice', position: ZIG[3]!, lessonId: 'inv5-practice' },
    { id: 'inv5-chest',         type: 'chest',    position: ZIG[4]!, chestReward: { brainBucks: 100, xp: 40 } },
    { id: 'inv5-l4-node',       type: 'lesson',   position: ZIG[5]!, lessonId: 'inv5-l4' },
    { id: 'inv5-trophy',        type: 'trophy',   position: ZIG[6]! },
  ],
  guidebook: cryptoUnitGuidebook,
  masteryThreshold: 70,
};
