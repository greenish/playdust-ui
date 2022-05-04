import { atom } from 'recoil'
import StatusEnum from '../../_helpers/statusEnum'

const collectionStatus = atom<StatusEnum>({
  key: 'collectionStatus',
  default: 0,
})

export default collectionStatus
