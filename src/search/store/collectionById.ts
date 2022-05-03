import { selectorFamily } from 'recoil'
import api from '../../App/_helpers/frontendApi'
import { CollectionSource } from '../types/OpenSearchIndex'

export const collectionById = selectorFamily({
  key: 'collectionById',
  get: (id) => async () => {
    const { data } = await api.post<CollectionSource[]>('/collections', [id])

    return data[0]
  },
})
