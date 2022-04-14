import { atom } from 'recoil'
import type SearchSort from '../types/SearchSort'

export type SearchSortOption = {
  name: string
  value: SearchSort
}

const makeSortOption = (
  name: string,
  field: SearchSort['field'],
  reverse?: boolean
) => {
  const result: SearchSortOption[] = [
    {
      name: `${name}: asc`,
      value: {
        field,
        direction: 'asc',
      },
    },
    {
      name: `${name}: desc`,
      value: {
        field,
        direction: 'desc',
      },
    },
  ]

  if (reverse) {
    return result.reverse()
  }

  return result
}

export const searchSort = atom<SearchSort | undefined>({
  key: 'searchSort',
  default: undefined,
})

export const searchSortOptions = atom<SearchSortOption[]>({
  key: 'searchSortOptions',
  default: [
    ...makeSortOption('Rarity', 'rarity-score', true),
    ...makeSortOption('Name', 'name'),
    ...makeSortOption('List Price', 'list-price'),
    ...makeSortOption('Sale Price', 'sale-price'),
    {
      name: 'Relevance',
      value: {
        field: 'relevance',
        direction: 'desc',
      },
    },
  ],
})
