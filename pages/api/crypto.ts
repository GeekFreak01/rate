import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = 'f98cc435-c24c-4084-869b-b798beb262f9';
const SYMBOLS = ['BTC', 'ETH', 'TON', 'NOT', 'SOL'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [quotesRes, infoRes] = await Promise.all([
      fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${SYMBOLS.join(',')}`, {
        headers: { 'X-CMC_PRO_API_KEY': API_KEY },
      }),
      fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${SYMBOLS.join(',')}`, {
        headers: { 'X-CMC_PRO_API_KEY': API_KEY },
      }),
    ]);

    const quotesJson = await quotesRes.json();
    const infoJson = await infoRes.json();

    const cryptos = SYMBOLS.map((symbol) => ({
      symbol,
      price: quotesJson.data[symbol].quote.USD.price,
      change: quotesJson.data[symbol].quote.USD.percent_change_24h,
      logo: infoJson.data[symbol].logo,
    }));

    res.status(200).json({ cryptos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения данных' });
  }
}
