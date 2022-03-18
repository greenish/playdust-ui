import { selectorFamily } from 'recoil'
import api from '../../../helpers/api'
import { CollectionOverviewResponse } from '../types/SearchResponse'

export const collectionOverview = selectorFamily<
  CollectionOverviewResponse,
  string
>({
  key: 'collectionOverview',
  get: (id: string) => async () => {
    const { data } = await api.get<CollectionOverviewResponse>(
      `/collection-overview?id=${id}`
    )

    return data
  },
})
