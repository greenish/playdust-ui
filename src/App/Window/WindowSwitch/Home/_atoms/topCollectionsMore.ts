import { atom } from 'recoil'
import type TopCollectionsResponseType from '../../../../../_types/TopCollectionsResponseType'

const topCollectionsMore = atom<TopCollectionsResponseType['results']>({
  key: 'topCollectionsMore',
  default: [],
})

export default topCollectionsMore
