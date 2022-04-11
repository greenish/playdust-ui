import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import * as store from './'

export interface SearchSortValue {
  field: 'name' | 'relevance' | 'list-price' | 'sale-price' | 'rarity-score'
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
  field: SearchSortValue['field'],
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
    ...makeSortOption('Rarity', 'rarity-score', true),
    ...makeSortOption('Name', 'name'),
    ...makeSortOption('List Price', 'list-price'),
    ...makeSortOption('Sale Price', 'sale-price'),
  ],
})

export const useSetSelectedSort = () => {
  const [options, setter] = useRecoilState(searchSortOptions)
  const onlyListedSetter = useSetRecoilState(store.searchOnlyListed)

  return (name: string) => {
    const nextOptions = options.map((entry) => {
      const selected = entry.name === name

      if (selected && entry.value.field === 'list-price') {
        onlyListedSetter(true)
      }

      return {
        ...entry,
        selected,
      }
    })

    setter(nextOptions)
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
