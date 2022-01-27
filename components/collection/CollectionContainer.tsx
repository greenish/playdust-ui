import CollectionFilters from './CollectionFilters'
import TokenContainer from '../token/TokenContainer'
import { collectionCursor, fetchCollectionPages } from '../../store'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import styled from '@emotion/styled'

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const FilterContainer = styled.div`
  display: flex;
  width: 300px;
  padding: 16px;
`

const TokenFlexContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`

const CollectionContainer = () => {
  const setCursor = useSetRecoilState(collectionCursor)
  const { initialized, tokens, total } = useRecoilValue(fetchCollectionPages)

  return (
    <RootContainer>
      <FilterContainer>
        <CollectionFilters />
      </FilterContainer>
      <TokenFlexContainer>
        <TokenContainer
          initialized={initialized}
          tokens={tokens}
          hasMore={total > tokens.length}
          next={() => {
            setCursor((cursor) => cursor + 1)
          }}
        />
      </TokenFlexContainer>
    </RootContainer>
  )
}

export default CollectionContainer
