import { atom } from 'recoil'

type SearchFilterFields = 'price'

export interface SearchFilter {
  label: string
  name: SearchFilterFields
}

const createFilterOption = (label: string, name: SearchFilterFields) => ({
  label,
  name,
})

export const searchFilters = atom<SearchFilter[]>({
  key: 'searchFilters',
  default: [createFilterOption('Filter by Price (SOL)', 'price')],
})
