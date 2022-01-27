import { selectorFamily } from 'recoil'
import type {
  MetaplexCollectionIdentifier,
  ParsedMetadata,
} from '../solana/types'
import axios from 'axios'
import collectionFilters, { CollectionFilterType } from './collectionFilters'
import collectionSort, { CollectionSortType } from './collectionSort'

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

const filterEntries = (
  data: ParsedMetadata[],
  filters: CollectionFilterType[]
) => {
  if (!filters.length) {
    return data
  }

  return data.filter((entry) =>
    filters.every((filter) => {
      const found = entry.offchain?.attributes?.find(
        (attribute: any) => attribute.trait_type === filter.trait
      )

      if (found) {
        return filter.options.includes(found.value)
      }

      return false
    })
  )
}

const sortEntries = (data: ParsedMetadata[], sort: CollectionSortType[]) => {
  sort.forEach((s) => data.sort(s.sortFunction(s.selectedValue)))
  return data
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
  get:
    ({ identifier, start, stop }) =>
    async ({ get }) => {
      const data = await getData(identifier.symbol)
      const filters = get(collectionFilters)
      const sort = get(collectionSort)

      cache[identifier.symbol] = data

      const filtered = sortEntries(filterEntries(data, filters), sort)

      return {
        data: filtered.slice(start, stop),
        total: filtered.length,
      }
    },
})

export default fetchCollection
