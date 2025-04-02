import type { NextApiRequest, NextApiResponse } from "next";

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const params = new URLSearchParams({
      ids: "bitcoin,ethereum,toncoin",
      vs_currencies: "usd",
      include_24hr_change: "true",
    });

    const fiatParams = new URLSearchParams({
      ids: "usd,eur",
      vs_currencies: "rub",
      include_24hr_change: "true",
    });

    const [cryptoRes, fiatRes] = await Promise.all([
      fetch(`${COINGECKO_API}?${params.toString()}`),
      fetch(`${COINGECKO_API}?${fiatParams.toString()}`),
    ]);

    const cryptoData = await cryptoRes.json();
    const fiatData = await fiatRes.json();

    res.status(200).json({
      btc: cryptoData.bitcoin.usd,
      eth: cryptoData.ethereum.usd,
      ton: cryptoData.toncoin.usd,
      usd: fiatData.usd.rub,
      eur: fiatData.eur.rub,
      changes: {
        btc: cryptoData.bitcoin.usd_24h_change,
        eth: cryptoData.ethereum.usd_24h_change,
        ton: cryptoData.toncoin.usd_24h_change,
        usd: fiatData.usd.rub_24h_change,
        eur: fiatData.eur.rub_24h_change,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rates" });
  }
}
