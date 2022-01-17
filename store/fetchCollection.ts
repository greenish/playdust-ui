import { selectorFamily } from 'recoil'
import type {
  MetaplexCollectionIdentifier,
  ParsedMetadata
} from '../solana/types'
import axios from 'axios'

const cache: any = {}

type FetchCollectionInput = {
  identifier: MetaplexCollectionIdentifier,
  start: number
  stop: number
}

type FetchCollectionOutput = {
  count: number
  tokens: ParsedMetadata[]
}

const fetchCollection = selectorFamily<
  FetchCollectionOutput,
  FetchCollectionInput
>({
  key: 'fetchCollection',
  get: ({ identifier, start, stop }) =>
    async () => {
      const { symbol } = identifier
      const cacheForSymbol = cache[symbol]

      if (cacheForSymbol) {
        return {
          count: cacheForSymbol.length,
          tokens: cache[symbol].slice(start, stop)
        }
      }

      const { data } = await axios.get(`/data/${symbol}.json`)

      cache[identifier.symbol] = data

      return {
        count: data.length,
        tokens: data.slice(start, stop),
      }
    },
})

export default fetchCollection
