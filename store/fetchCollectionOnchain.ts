import { selectorFamily } from 'recoil'
import * as solana from '../solana'
import type {
  MetaplexCollectionIdentifier,
  ParsedOnchain,
} from '../solana/types'

const fetchCollectionOnchain = selectorFamily<
  ParsedOnchain[],
  MetaplexCollectionIdentifier
>({
  key: 'fetchCollectionOnchain',
  get: (identifier: MetaplexCollectionIdentifier) => async () => {
    const result = await solana.fetchOnchain.byCollection(identifier)

    return result
  },
})

export default fetchCollectionOnchain
