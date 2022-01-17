import { atom } from 'recoil'

const collectionCursor = atom<number>({
  key: 'collectionCursor',
  default: 1,
})

export default collectionCursor
