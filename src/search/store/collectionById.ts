import { selectorFamily } from 'recoil'
import api from '../../common/helpers/frontendApi'
import { CollectionSource } from '../types/OpenSearchIndex'

export const collectionById = selectorFamily({
  key: 'collectionById',
  get: (id) => async () => {
    const { data } = await api.post<CollectionSource[]>('/collections', [id])

    return data[0]
  },
})
