import styled from '@emotion/styled'
import * as store from '../../store'
import TokenContainer from '../token/TokenContainer'

const NoTokensContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const SearchResults = () => {
  const { results, initialized } = store.useNoWaitSearchResult()

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
      hasMore={false}
      next={() => null}
    />
  )
}

export default SearchResults
