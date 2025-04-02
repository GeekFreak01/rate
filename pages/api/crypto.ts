import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = "f98cc435-c24c-4084-869b-b798beb262f9";
const CMC_URL =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,TON,NOT,SOL";

// Примитивный in-memory кэш
let cache: any = null;
let lastFetched: Date | null = null;

function isToday8AMTashkent(date: Date) {
  const now = new Date();
  const utcOffset = 5; // Ташкент UTC+5
  const localHour = now.getUTCHours() + utcOffset;
  return (
    date.getUTCDate() === now.getUTCDate() &&
    localHour >= 8
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Если кэш свежий — отдаём его
  if (cache && lastFetched && isToday8AMTashkent(lastFetched)) {
    return res.status(200).json(cache);
  }

  try {
    const response = await fetch(CMC_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
      },
    });

    const result = await response.json();
    const data = result.data;

    const extract = (symbol: string) => data[symbol];

    const rates = {
      btc: extract("BTC").quote.USD.price,
      eth: extract("ETH").quote.USD.price,
      ton: extract("TON").quote.USD.price,
      not: extract("NOT").quote.USD.price,
      sol: extract("SOL").quote.USD.price,
      changes: {
        btc: extract("BTC").quote.USD.percent_change_24h,
        eth: extract("ETH").quote.USD.percent_change_24h,
        ton: extract("TON").quote.USD.percent_change_24h,
        not: extract("NOT").quote.USD.percent_change_24h,
        sol: extract("SOL").quote.USD.percent_change_24h,
      },
    };

    // Сохраняем в кэш
    cache = rates;
    lastFetched = new Date();

    res.status(200).json(rates);
  } catch (err) {
    console.error("CoinMarketCap API error:", err);
    res.status(500).json({ error: "Failed to fetch crypto data" });
  }
}
