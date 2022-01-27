import { atom, selector, selectorFamily, useRecoilCallback } from 'recoil'
import { ParsedMetadata } from '../solana/types'

export type CollectionSortType = {
  name: string
  values: any[]
  selectedValue: any
  sortFunction: Function
}

const collectionSort = atom<CollectionSortType[]>({
  key: 'collectionSort',
  default: [
    {
      name: 'Name',
      values: ['asc', 'desc'],
      selectedValue: 'asc',
      sortFunction: (value: any) => (a: ParsedMetadata, b: ParsedMetadata) => {
        if (!value) {
          return undefined
        }
        if (value === 'asc') {
          return a.onchain.data.name.localeCompare(
            b.onchain.data.name,
            undefined,
            {
              numeric: true,
              sensitivity: 'base',
            }
          )
        } else {
          return b.onchain.data.name.localeCompare(
            a.onchain.data.name,
            undefined,
            {
              numeric: true,
              sensitivity: 'base',
            }
          )
        }
      },
    },
  ],
})

export default collectionSort
