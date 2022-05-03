import { atom } from 'recoil'
import Status from '../../App/_helpers/statusEnum'

export const collectionStatus = atom<Status>({
  key: 'collectionStatus',
  default: 0,
})
