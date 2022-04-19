import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import TokenContainer from './TokenContainer'

const NoTokensContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const SearchResults = () => {
  const { nfts, total } = useRecoilValue(store.allSearchResults)
  const fetchMoreSearchResults = store.useFetchMoreSearchResults()

  if (nfts.length === 0) {
    return (
      <NoTokensContainer>
        <i>no tokens found...</i>
      </NoTokensContainer>
    )
  }

  return (
    <TokenContainer
      initialized={true}
      tokens={nfts}
      total={total}
      next={async () => {
        await fetchMoreSearchResults()
      }}
    />
  )
}

export default SearchResults
