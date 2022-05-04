import { atom } from 'recoil'

interface FlaggedType {
  id: string
  type: 'Collection' | 'NFT' | undefined
  open: boolean
}

const flaggedCollection = atom<FlaggedType>({
  key: 'flaggedCollection',
  default: {
    open: false,
    id: '',
    type: undefined,
  },
})

export default flaggedCollection
