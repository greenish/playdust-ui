import { atom } from 'recoil'
import { MetaplexCollectionIdentifier } from '../solana/types'

const collectionIdentifier = atom<MetaplexCollectionIdentifier | null>({
  key: 'collectionIdentifier',
  default: null,
})

export default collectionIdentifier