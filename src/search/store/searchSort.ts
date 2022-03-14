import { atom, useSetRecoilState } from 'recoil'

export interface SearchSortValue {
  field: 'name' | 'relevance'
  direction: 'asc' | 'desc'
}

export type SearchSortOption = {
  name: string
  value: SearchSortValue
  selected?: boolean
}

export type SearchSortType = {
  selectedIndex: number
  options: SearchSortOption[]
}

const makeSortOption = (
  name: string,
  field: SearchSortValue['field']
): [SearchSortOption, SearchSortOption] => [
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

export const searchSortOptions = atom<SearchSortOption[]>({
  key: 'searchSortOptions',
  default: [
    {
      name: 'Relevance',
      value: {
        field: 'relevance',
        direction: 'desc',
      },
    },
    ...makeSortOption('Name', 'name'),
  ],
})

export const useSetSelectedSort = () => {
  const setter = useSetRecoilState(searchSortOptions)

  return (name: string) => {
    setter((options) =>
      options.map((entry) => ({
        ...entry,
        selected: entry.name === name,
      }))
    )
  }
}

export const useSetSelectedSortByValue = () => {
  const setter = useSetRecoilState(searchSortOptions)

  return (value: SearchSortValue) => {
    setter((options) =>
      options.map((entry) => ({
        ...entry,
        selected:
          entry.value.field === value?.field &&
          entry.value.direction === value?.direction,
      }))
    )
  }
}
