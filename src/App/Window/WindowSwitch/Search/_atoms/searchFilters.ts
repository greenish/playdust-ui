import { atom } from 'recoil'
import type SearchFilterUnionType from '../../../../../_types/SearchFilterUnionType'

export interface SearchFilterType {
  label: string
  name: SearchFilterUnionType
}

const searchFilters = atom<SearchFilterType[]>({
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

export default searchFilters
