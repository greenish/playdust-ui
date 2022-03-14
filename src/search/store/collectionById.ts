import { selectorFamily } from 'recoil'
import api from '../../../helpers/api'
import { SearchCollectionResponse } from '../types/SearchResponse'

export const collectionById = selectorFamily({
  key: 'collectionById',
  get: (id) => async () => {
    const { data } = await api.post<SearchCollectionResponse>('/collections', [
      id,
    ])

    return data.results[0]
  },
})
