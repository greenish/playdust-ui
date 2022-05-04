import { useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import type TopCollectionsResponseType from '../../../../../_types/TopCollectionsResponseType'
import frontendApi from '../../../../_helpers/frontendApi'
import topCollectionsBase from '../_atoms/topCollectionsBase'
import topCollectionsMore from '../_atoms/topCollectionsMore'

const useFetchMoreTopCollections = () => {
  const topCollectionsLoadable = useRecoilValueLoadable(topCollectionsBase)
  const setter = useSetRecoilState(topCollectionsMore)

  return async () => {
    if (topCollectionsLoadable.state === 'hasValue') {
      const { data } = await frontendApi.post<TopCollectionsResponseType>(
        '/top-collections',
        {
          cursor: topCollectionsLoadable.contents.cursor,
        }
      )

      setter((curr) => [...curr, ...data.results])
    }
  }
}

export default useFetchMoreTopCollections
