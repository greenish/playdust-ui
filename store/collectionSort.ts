import { atom, useRecoilCallback } from 'recoil'
import { ParsedMetadata } from '../solana/types'
import collectionCursor from './collectionCursor'

type CollectionSortOption = {
  name: string
  sortFunction: (a: ParsedMetadata, b: ParsedMetadata) => number
}

export type CollectionSortType = {
  selectedIndex: number
  options: {
    name: string
    sortFunction: (a: ParsedMetadata, b: ParsedMetadata) => number
  }[]
}

const makeRarityOptions = (
  name: string,
  primaryName: string,
  secondaryName: string,
  primaryFunction: (a: ParsedMetadata, b: ParsedMetadata) => number
): [CollectionSortOption, CollectionSortOption] => [
  {
    name: `${name}: ${primaryName}`,
    sortFunction: primaryFunction,
  },
  {
    name: `${name}: ${secondaryName}`,
    sortFunction: (a, b) => -primaryFunction(a, b),
  },
]

const collectionSort = atom<CollectionSortType>({
  key: 'collectionSort',
  default: {
    selectedIndex: 0,
    options: [
      ...makeRarityOptions(
        'Rarity Score',
        'high to low',
        'low to high',
        (a, b) => {
          if (!a.rarityScore || !b.rarityScore) {
            return 0
          }

          return b.rarityScore - a.rarityScore
        }
      ),
      ...makeRarityOptions(
        'Statistical Rarity',
        'high to low',
        'low to high',
        (a, b) => {
          if (!a.statisticalRarity || !b.statisticalRarity) {
            return 0
          }

          return a.statisticalRarity - b.statisticalRarity
        }
      ),
      ...makeRarityOptions('Name', 'asc', 'desc', (a, b) => {
        return a.onchain.data.name.localeCompare(
          b.onchain.data.name,
          undefined,
          {
            numeric: true,
            sensitivity: 'base',
          }
        )
      }),
    ],
  },
})

export const useSetSelectedSort = () => {
  const callback = useRecoilCallback(
    ({ reset, set }) =>
      async (selectedIndex: number) => {
        set(collectionSort, (current) => ({
          ...current,
          selectedIndex,
        }))
        reset(collectionCursor)
      },
    []
  )

  return callback
}

export default collectionSort
