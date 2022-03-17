import { atom } from 'recoil'

export type SearchFilterFields = 'list-price' | 'sale-price'

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
  ],
})
