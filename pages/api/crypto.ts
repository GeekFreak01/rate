import type { NextApiRequest, NextApiResponse } from "next";

interface Coin {
  symbol: string;
  price_usd: string;
  percent_change_24h: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://api.coinlore.net/api/tickers/?limit=50");
    const data = await response.json();

    const coins = data.data as Coin[];

    const getCoin = (symbol: string) =>
      coins.find((coin) => coin.symbol.toUpperCase() === symbol.toUpperCase());

    const btc = getCoin("BTC");
    const eth = getCoin("ETH");
    const ton = getCoin("TON");

    if (!btc || !eth || !ton) {
      return res.status(500).json({ error: "Coin data not found" });
    }

    res.status(200).json({
      btc: parseFloat(btc.price_usd),
      eth: parseFloat(eth.price_usd),
      ton: parseFloat(ton.price_usd),
      usd: 1, // фиктивно, так как CoinLore не отдаёт фиат
      eur: 1,
      changes: {
        btc: parseFloat(btc.percent_change_24h),
        eth: parseFloat(eth.percent_change_24h),
        ton: parseFloat(ton.percent_change_24h),
        usd: 0,
        eur: 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data from CoinLore" });
  }
}
