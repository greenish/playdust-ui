import { selectorFamily } from 'recoil'
import type {
  MetaplexCollectionIdentifier,
  ParsedMetadata
} from '../solana/types'
import axios from 'axios'
import collectionFilters, { CollectionFilterType } from './collectionFilters'

const cache: any = {}

type FetchCollectionInput = {
  identifier: MetaplexCollectionIdentifier
  start: number
  stop: number
}

type FetchCollectionOutput = {
  data: ParsedMetadata[]
  total: number
}

const filterEntries = (data: ParsedMetadata[], filters: CollectionFilterType[]) => {
  if (!filters.length) {
    return data
  }

  return data.filter(entry =>
    filters.every(filter => {
      const found = entry.offchain?.attributes?.find((attribute: any) =>
        attribute.trait_type === filter.trait
      )

      if (found) {
        return filter.options.includes(found.value)
      }

      return false
    })
  )
}

const getData = async (symbol: string): Promise<ParsedMetadata[]> => {
  const cacheForSymbol = cache[symbol]

  if (cacheForSymbol) {
    return cacheForSymbol
  }

  const { data } = await axios.get<ParsedMetadata[]>(`/data/${symbol}.json`)


  return data
}

const fetchCollection = selectorFamily<
  FetchCollectionOutput,
  FetchCollectionInput
>({
  key: 'fetchCollection',
  get: ({ identifier, start, stop }) =>
    async ({ get }) => {
      const data = await getData(identifier.symbol)
      const filters = get(collectionFilters)

      cache[identifier.symbol] = data

      const filtered = filterEntries(data, filters)

      return {
        data: filtered.slice(start, stop),
        total: filtered.length,
      }
    },
})

export default fetchCollection
