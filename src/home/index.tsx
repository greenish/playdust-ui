import styled from '@emotion/styled'
import { useMemo } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { humanizeSolana } from '../common/helpers/utils'
import { TokenGroup } from '../search/components/TokenGrid'
import humanizeCollection from '../search/helpers/humanizeCollection'
import { useInitCollectionQuery } from '../search/hooks/useSearchChange'
import * as store from './store'

const RootContainer = styled.div`
  padding-left: 16px;
  overflow: hidden;
  height: 100%;
  width: 100%;
`

const Home = () => {
  const topCollectionsLoadable = useRecoilValueLoadable(store.topCollectionsAll)
  const fetchMore = store.useFetchMoreTopCollections()
  const initCollectionQuery = useInitCollectionQuery('href')
  const hasValue = topCollectionsLoadable.state === 'hasValue'

  const grouped = useMemo(() => {
    if (hasValue) {
      const { results } = topCollectionsLoadable.contents

      return results.map(({ collection, nfts }) => ({
        key: collection.id,
        groupLabel: humanizeCollection(collection)!,
        groupSecondary: humanizeSolana(collection.totalVolume),
        groupHref: initCollectionQuery(collection.id),
        groupTotal: collection.elementCount,
        nfts,
      }))
    }

    return []
  }, [topCollectionsLoadable])

  return (
    <RootContainer>
      <TokenGroup
        initialized={hasValue}
        grouped={grouped}
        totalRows={hasValue ? topCollectionsLoadable.contents.total : 0}
        imageSize={150}
        cardGap={16}
        rowGap={24}
        contentHeight={0}
        next={async () => {
          await fetchMore()
        }}
      />
    </RootContainer>
  )
}

export default Home
