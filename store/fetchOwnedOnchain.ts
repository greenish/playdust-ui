import {
  SerializableParam,
  selectorFamily,
} from 'recoil'
import type {
  ParsedMetadata
} from '../solana/types'
import * as solana from '../solana'

const fetchOwnedOnchain = selectorFamily<ParsedMetadata[], any>({
  key: 'fetchCollectionOnchain',
  get: publicKey =>
    async () => {
      const result = await solana.fetchOnchain.byOwner(publicKey)

      return result
    },
})

export default fetchOwnedOnchain