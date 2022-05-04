import { selectorFamily } from 'recoil'
import type CollectionOverviewResponseType from '../../../../../_types/CollectionOverviewResponseType'
import api from '../../../../_helpers/frontendApi'

const collectionOverview = selectorFamily<
  CollectionOverviewResponseType,
  string
>({
  key: 'collectionOverview',
  get: (id: string) => async () => {
    const { data } = await api.get<CollectionOverviewResponseType>(
      `/collection-overview?id=${id}`
    )

    return data
  },
})

export default collectionOverview
