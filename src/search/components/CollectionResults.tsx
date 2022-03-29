import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import CollectionCard from './CollectionCard'
import CollectionOverview from './CollectionOverview'

const cardSize = 250
const topSpace = 8
const bottomSpace = 16
const totalHeight = cardSize + topSpace + bottomSpace

const RootContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding-top: ${topSpace}px;
  margin-bottom: ${bottomSpace}px;
  padding-left: 16px;
  min-height: ${totalHeight}px;
  overflow-x: auto;
`

const OverviewContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const CollectionResults = () => {
  const { collections } = useRecoilValue(store.searchResults)
  const initCollectionQuery = store.useInitializeCollectionQuery()
  const isCollectionQuery = useRecoilValue(store.isCollectionQuery)

  if (collections.length === 0 && !isCollectionQuery) {
    return <></>
  }

  return (
    <RootContainer>
      {isCollectionQuery ? (
        <OverviewContainer>
          <CollectionOverview />
        </OverviewContainer>
      ) : (
        collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            {...collection}
            cardSize={200}
            onClick={initCollectionQuery}
          />
        ))
      )}
    </RootContainer>
  )
}

export default CollectionResults
