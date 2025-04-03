import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = 'f98cc435-c24c-4084-869b-b798beb262f9';
const symbols = ['BTC', 'ETH', 'TON', 'NOT', 'SOL'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const quotesRes = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=' + symbols.join(','),
      {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
        },
      }
    );

    const metaRes = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=' + symbols.join(','),
      {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
        },
      }
    );

    const quotesData = await quotesRes.json();
    const metaData = await metaRes.json();

    const response = symbols.reduce((acc, symbol) => {
      acc[symbol] = {
        price: quotesData.data[symbol].quote.USD.price,
        change: quotesData.data[symbol].quote.USD.percent_change_24h,
        logo: metaData.data[symbol].logo,
      };
      return acc;
    }, {} as Record<string, { price: number; change: number; logo: string }>);

    res.status(200).json({ date: new Date().toISOString(), data: response });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
