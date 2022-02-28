import { selectorFamily, useRecoilValue } from 'recoil'
import { fetchCoinGecko } from './fetchCoinGecko'

export const fetchCoinPrice = selectorFamily<any, string>({
  key: 'coinPrice',
  get:
    (coin) =>
    async ({ get }) => {
      if (!coin) {
        return 0
      }

      const resp = get(fetchCoinGecko(coin))

      return resp?.data?.market_data?.current_price?.usd ?? 0
    },
})

export const useCoinPrice = (coin: string) =>
  useRecoilValue(fetchCoinPrice(coin))

export const useSOLPrice = () => useCoinPrice('solana')
