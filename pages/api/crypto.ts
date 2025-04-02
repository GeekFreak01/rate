import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://api.coinlore.net/api/tickers/?limit=100");
    const data = await response.json();

    const coins = data.data;

    const get = (symbol: string) =>
      coins.find((c: any) => c.symbol.toUpperCase() === symbol.toUpperCase());

    const btc = get("BTC");
    const eth = get("ETH");
    const ton = get("TON");
    const not = get("NOT");
    const sol = get("SOL");

    if (!btc || !eth || !ton || !not || !sol) {
      return res.status(500).json({ error: "Missing data" });
    }

    res.status(200).json({
      btc: parseFloat(btc.price_usd),
      eth: parseFloat(eth.price_usd),
      ton: parseFloat(ton.price_usd),
      not: parseFloat(not.price_usd),
      sol: parseFloat(sol.price_usd),
      changes: {
        btc: parseFloat(btc.percent_change_24h),
        eth: parseFloat(eth.percent_change_24h),
        ton: parseFloat(ton.percent_change_24h),
        not: parseFloat(not.percent_change_24h),
        sol: parseFloat(sol.percent_change_24h),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "API error" });
  }
}
