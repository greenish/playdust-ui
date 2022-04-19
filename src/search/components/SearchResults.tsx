import styled from '@emotion/styled'
import { useRecoilValueLoadable } from 'recoil'
import * as store from '../store'
import TokenContainer from './TokenContainer'

const NoTokensContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 64px;
`

const SearchResults = () => {
  const loadable = useRecoilValueLoadable(store.searchResultsAll)
  const fetchMoreSearchResults = store.useFetchMoreSearchResults()
  const hasValue = loadable.state === 'hasValue'

  if (hasValue && loadable.contents.total === 0) {
    return (
      <NoTokensContainer>
        <i>no results found...</i>
      </NoTokensContainer>
    )
  }

  return (
    <TokenContainer
      initialized={hasValue}
      tokens={hasValue ? loadable.contents.nfts : []}
      total={hasValue ? loadable.contents.total : 0}
      next={async () => {
        await fetchMoreSearchResults()
      }}
    />
  )
}

export default SearchResults
