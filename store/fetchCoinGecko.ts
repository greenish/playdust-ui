import axios from 'axios'
import { selectorFamily, useRecoilValue } from 'recoil'

const coinGeckoApiBaseUrl = 'https://api.coingecko.com/api/v3'

export const fetchCoinGecko = selectorFamily<any, string>({
  key: 'coinGecko',
  get:
    (coin) =>
    async ({ get }) => {
      if (!coin) {
        return null
      }

      const url = `${coinGeckoApiBaseUrl}/coins/${coin}`

      const resp = await axios.get<any>(url)

      return resp
    },
})

export const useCoinGecko = (coin: string) =>
  useRecoilValue(fetchCoinGecko(coin))
