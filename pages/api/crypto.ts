import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    btc: 83000,
    eth: 3200,
    ton: 5.35,
    usd: 89.45,
    eur: 96.23,
    changes: {
      btc: 1.42,
      eth: 0.73,
      ton: 3.51,
      usd: 0.2,
      eur: 0.3,
    },
  })
}

