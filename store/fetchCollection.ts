import axios from 'axios'
import { selectorFamily } from 'recoil'
import type {
  MetaplexCollectionIdentifier,
  ParsedMetadata,
} from '../solana/types'
import collectionSort, { CollectionSortType } from './collectionSort'
import searchQuery, { ComposedQueryType } from './searchQuery'

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

const queryEntries = (data: ParsedMetadata[], query: ComposedQueryType) => {
  if (!query.length) {
    return data
  }

  return data.filter((entry) =>
    query.every((parent) =>
      parent.some((child) => {
        if (!child.value) {
          return parent.length === 1
        }

        if (child.searchType === 'relevance') {
          return true
        }

        if (child.field === 'attribute' && Array.isArray(child.value)) {
          return child.value.some((queryValue) =>
            entry.offchain.attributes.find(
              (attribute) =>
                attribute.trait_type === child.trait &&
                attribute.value === queryValue
            )
          )
        }

        if (child.field === 'collection') {
          return entry.onchain.data.name.includes(child.value as string)
        }

        return true
      })
    )
  )
}

const sortEntries = (data: ParsedMetadata[], sort: CollectionSortType) => {
  const { selectedIndex } = sort

  return data.sort(sort.options[selectedIndex].sortFunction)
}

const getData = async (symbol: string): Promise<ParsedMetadata[]> => {
  const cacheForSymbol = cache[symbol]

  if (cacheForSymbol) {
    return cacheForSymbol
  }

  const { data } = await axios.get<ParsedMetadata[]>(
    `/data/${symbol}-RANKED.json`
  )

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
      const query = get(searchQuery)
      const sort = get(collectionSort)

      cache[identifier.symbol] = data

      const queried = sortEntries(queryEntries(data, query), sort)

      return {
        data: queried.slice(start, stop),
        total: queried.length,
      }
    },
})

export default fetchCollection
