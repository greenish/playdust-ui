import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDeepCompareEffect, useLocation } from 'react-use'
import { useRecoilValue } from 'recoil'
import { isHashEmpty, parseHash, stringifyHash } from '../helpers/searchHash'
import * as store from '../store'
import TokenContainer from './TokenContainer'

const NoTokensContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const SearchResults = () => {
  const router = useRouter()
  const location = useLocation()
  const current = useRecoilValue(store.searchResults)
  const { nfts, initialized } = current
  const { results, total } = nfts
  const fetchSearchResults = store.useFetchSearchResults()
  const fetchMoreSearchResults = store.useFetchMoreSearchResults()
  const searchQueryValid = useRecoilValue(store.searchQueryValid)
  const searchSortSelected = useRecoilValue(store.searchSortSelected)
  const bootstrapSearchQuery = store.useBootstrapSearchQuery()
  const setSelectedSort = store.useSetSelectedSortByValue()
  const [didMount, setDidMount] = useState(false)

  const updateFromHash = useCallback(() => {
    const payload = parseHash()
    bootstrapSearchQuery(payload.query)

    setSelectedSort(payload.sort)
  }, [])

  useEffect(() => {
    if (isHashEmpty()) {
      fetchSearchResults(searchQueryValid, searchSortSelected.value)
    } else {
      updateFromHash()
    }

    setDidMount(true)
  }, [])

  useEffect(() => {
    if (location.trigger === 'popstate') {
      updateFromHash()
    }
  }, [location])

  useDeepCompareEffect(() => {
    if (didMount) {
      router.push({
        pathname: router.pathname,
        hash: stringifyHash(searchQueryValid, searchSortSelected.value),
      })

      fetchSearchResults(searchQueryValid, searchSortSelected.value)
    }
  }, [searchQueryValid, searchSortSelected.value])

  if (initialized && results.length === 0) {
    return (
      <NoTokensContainer>
        <i>no tokens found...</i>
      </NoTokensContainer>
    )
  }

  return (
    <TokenContainer
      initialized={true}
      tokens={results}
      total={total}
      next={async () => {
        return fetchMoreSearchResults(current)
      }}
    />
  )
}

export default SearchResults
