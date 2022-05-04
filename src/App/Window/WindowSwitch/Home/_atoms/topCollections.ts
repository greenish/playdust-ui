import { selector } from 'recoil'
import type TopCollectionsResponseType from '../../../../../_types/TopCollectionsResponseType'
import topCollectionsBase from './topCollectionsBase'
import topCollectionsMore from './topCollectionsMore'

const topCollections = selector<TopCollectionsResponseType>({
  key: 'topCollections',
  get: ({ get }) => {
    const base = get(topCollectionsBase)
    const more = get(topCollectionsMore)

    return {
      ...base,
      results: [...base.results, ...more],
    }
  },
})

export default topCollections
