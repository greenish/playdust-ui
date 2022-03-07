import { atom, useRecoilCallback } from 'recoil'

export interface SearchSort {
  field: string
  direction: string
}

type SearchSortOption = {
  name: string
  sort: SearchSort
}

export type SearchSortType = {
  selectedIndex: number
  options: SearchSortOption[]
}

const makeSortOption = (
  name: string,
  primaryName: string,
  secondaryName: string,
  field: string
): [SearchSortOption, SearchSortOption] => [
  {
    name: `${name}: ${primaryName}`,
    sort: {
      field,
      direction: primaryName,
    },
  },
  {
    name: `${name}: ${secondaryName}`,
    sort: {
      field,
      direction: secondaryName,
    },
  },
]

export const searchSort = atom<SearchSortType>({
  key: 'searchSort',
  default: {
    selectedIndex: 0,
    options: [...makeSortOption('Name', 'asc', 'desc', 'name')],
  },
})

export const useSetSelectedSort = () => {
  const callback = useRecoilCallback(
    ({ set }) =>
      async (selectedIndex: number) => {
        set(searchSort, (current) => ({
          ...current,
          selectedIndex,
        }))
      },
    []
  )

  return callback
}
