/**
 * Slug → lesson-deck filename, carried over verbatim from the original site's
 * `lib/sessions.ts`. Add an entry here when a new HTML session file lands.
 */
export const foundationDecks = {
  '01-market-basics': 'session1_stock_market_basics.html',
  '02-market-landscape': 'session2_market_landscape.html',
  '03-how-people-trade': 'session3_how_people_trade.html',
  '04-reading-charts': 'session4_reading_charts.html',
  '05-reading-companies': 'session5_reading_companies.html',
}

export const algoTrackDecks = {
  '00-intro': 'session0_algorithmic_trading_without_the_mystique.html',
  '01-what-is-an-algorithm': 'session1_what_is_an_algorithm.html',
  '02-why-algos-at-all': 'session2_why_algos_at_all.html',
  '03-anatomy-of-a-trade': 'session3_anatomy_of_a_trade_and_a_strategy.html',
  '04-backtesting': 'session4_backtesting_testing_ideas_on_the_past.html',
  '05-from-backtest-to-live': 'session5_from_backtest_to_live.html',
  '06-architect-your-algo': 'session6_architect_your_algo.html',
  '07-what-ai-brings': 'session7_what_ai_brings_to_algo_trading.html',
}

export const deckMaps = {
  foundation: { dir: 'foundation', map: foundationDecks },
  'algo-track': { dir: 'algo-track', map: algoTrackDecks },
}
