import { atom } from 'recoil'

export type SearchFilterFields = 'list-price' | 'sale-price' | 'rarity-score'

export interface SearchFilter {
  label: string
  name: SearchFilterFields
}

export const searchFilters = atom<SearchFilter[]>({
  key: 'searchFilters',
  default: [
    {
      label: 'Filter by list price',
      name: 'list-price',
    },
    {
      label: 'Filter by sale price',
      name: 'sale-price',
    },
    {
      label: 'Filter by rarity',
      name: 'rarity-score',
    },
  ],
})
