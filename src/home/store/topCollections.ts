import {
  atom,
  selector,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'
import frontendApi from '../../App/_helpers/frontendApi'
import { TopCollectionResponse } from '../../search/types/SearchResponse'

export const topCollections = selector<TopCollectionResponse>({
  key: 'topCollections',
  get: async () => {
    const { data } = await frontendApi.post<TopCollectionResponse>(
      '/top-collections'
    )

    return data
  },
})

const topCollectionsMore = atom<TopCollectionResponse['results']>({
  key: 'topCollectionsMore',
  default: [],
})

export const topCollectionsAll = selector<TopCollectionResponse>({
  key: 'topCollectionsAll',
  get: ({ get }) => {
    const base = get(topCollections)
    const more = get(topCollectionsMore)

    return {
      ...base,
      results: [...base.results, ...more],
    }
  },
})

export const useFetchMoreTopCollections = () => {
  const topCollectionsLoadable = useRecoilValueLoadable(topCollections)
  const setter = useSetRecoilState(topCollectionsMore)

  return async () => {
    if (topCollectionsLoadable.state === 'hasValue') {
      const { data } = await frontendApi.post<TopCollectionResponse>(
        '/top-collections',
        {
          cursor: topCollectionsLoadable.contents.cursor,
        }
      )

      setter((curr) => [...curr, ...data.results])
    }
  }
}
