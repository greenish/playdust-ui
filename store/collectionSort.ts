import { atom, useRecoilCallback } from 'recoil'

type CollectionSortOption = {
  name: string
  sortAttribute: Object
}

export type CollectionSortType = {
  selectedIndex: number
  options: {
    name: string
    sortAttribute: Object
  }[]
}

const makeRarityOptions = (
  name: string,
  primaryName: string,
  secondaryName: string,
  attribute: string
): [CollectionSortOption, CollectionSortOption] => [
  {
    name: `${name}: ${primaryName}`,
    sortAttribute: {
      [attribute]: {
        order: primaryName,
      },
    },
  },
  {
    name: `${name}: ${secondaryName}`,
    sortAttribute: {
      [attribute]: {
        order: secondaryName,
      },
    },
  },
]

const collectionSort = atom<CollectionSortType>({
  key: 'collectionSort',
  default: {
    selectedIndex: 0,
    options: [
      /*...makeRarityOptions(
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
      ),*/
      ...makeRarityOptions('Name', 'asc', 'desc', 'offChainData.name.keyword'),
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
      },
    []
  )

  return callback
}

export default collectionSort
