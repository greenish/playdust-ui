import { TokenInfo, TokenInfoMap } from '@solana/spl-token-registry'
import axios from 'axios'
import { selector, useRecoilValue } from 'recoil'

const tokenRegistryUrl =
  'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json'

export const fetchTokenRegistry = selector<any>({
  key: 'tokenRegistry',
  get: async ({ get }) => {
    const resp = await axios.get<any>(tokenRegistryUrl)
    const tokenList = resp.data.tokens

    const tokenRegistry = tokenList.reduce(
      (map: TokenInfoMap, item: TokenInfo) => {
        map.set(item.address, item)
        return map
      },
      new Map()
    )

    return tokenRegistry
  },
})

export const useTokenRegistry = () => useRecoilValue(fetchTokenRegistry)
