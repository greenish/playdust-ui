import { selectorFamily } from 'recoil'
import * as solana from '../../../solana'

export const fetchOffchain = selectorFamily<any, string>({
  key: 'fetchOffchain',
  get: (uri: string) => async () => {
    const result = solana.fetchOffchain(uri)

    return result
  },
})
