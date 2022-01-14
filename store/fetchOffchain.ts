import { selectorFamily } from 'recoil'
import * as solana from '../solana'

const fetchOffchain = selectorFamily<any, string>({
  key: 'fetchOffchain',
  get: (uri: string) =>
    async () => {
      const result = solana.fetchOffchain(uri)

      return result
    },
  })

export default fetchOffchain