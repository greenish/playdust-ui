import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import * as store from '../../store'
import TokenContainer from '../token/TokenContainer'

const NoTokensContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const SearchResults = () => {
  const current = useRecoilValue(store.searchResults)
  const { results, initialized, total } = current
  const fetchMoreSearchResults = store.useFetchMoreSearchResults()
  const searchQueryValid = useRecoilValue(store.searchQueryValid)
  const initializeSearchResults = store.useInitializeSearchResults()

  useEffect(() => {
    initializeSearchResults(searchQueryValid)
  }, [searchQueryValid])

  if (initialized && results.length === 0) {
    return (
      <NoTokensContainer>
        <i>add filters to view tokens...</i>
      </NoTokensContainer>
    )
  }

  return (
    <TokenContainer
      initialized={initialized}
      tokens={results}
      total={total}
      next={async () => {
        return fetchMoreSearchResults(current)
      }}
    />
  )
}

export default SearchResults
