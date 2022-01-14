import { selectorFamily } from 'recoil'
import type {
  MetaplexCollectionIdentifier,
  ParsedMetadata
} from '../solana/types'
import * as solana from '../solana'

const fetchCollectionOnchain = selectorFamily<ParsedMetadata[], MetaplexCollectionIdentifier>({
  key: 'fetchCollectionOnchain',
  get: (identifier: MetaplexCollectionIdentifier) =>
    async () => {
      const result = await solana.fetchOnchain.byCollection(identifier)

      return result
    },
})

export default fetchCollectionOnchain