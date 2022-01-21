// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import axios from '../../../helpers/axios'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const postData = JSON.parse(req.body)

      // we can get auction house key from the api below
      // https://ah-demo.beta.live/api/auction-house/show
      return axios
        .post(`/auction-house/${process.env.AH_KEY}/sell`, {
          wallet: postData.wallet,
          // https://solscan.io/token/LN1BZi5KKAhGooRa7Pjqtq7UpSVT8LK1sYT8RBEqMfB?cluster=devnet
          mint: postData.mint, // "LN1BZi5KKAhGooRa7Pjqtq7UpSVT8LK1sYT8RBEqMfB",
          buyPrice: postData.price,
          tokenSize: 1,
        })
        .then(({ data }) => res.status(200).json(data))
        .catch((e) => res.status(500).json(e))
    }
    default: {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
}
