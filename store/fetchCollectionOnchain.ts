import { selectorFamily } from 'recoil'
import type {
  MetaplexCollectionIdentifier,
  ParsedOnchain
} from '../solana/types'
import * as solana from '../solana'

const fetchCollectionOnchain = selectorFamily<ParsedOnchain[], MetaplexCollectionIdentifier>({
  key: 'fetchCollectionOnchain',
  get: (identifier: MetaplexCollectionIdentifier) =>
    async () => {
      const result = await solana.fetchOnchain.byCollection(identifier)

      return result
    },
})

export default fetchCollectionOnchain