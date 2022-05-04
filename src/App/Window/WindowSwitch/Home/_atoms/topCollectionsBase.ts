import { selector } from 'recoil'
import type TopCollectionsResponseType from '../../../../../_types/TopCollectionsResponseType'
import frontendApi from '../../../../_helpers/frontendApi'

const topCollectionsBase = selector<TopCollectionsResponseType>({
  key: 'topCollectionsBase',
  get: async () => {
    const { data } = await frontendApi.post<TopCollectionsResponseType>(
      '/top-collections'
    )

    return data
  },
})

export default topCollectionsBase
