import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDeepCompareEffect, useLocation } from 'react-use'
import { useRecoilValue } from 'recoil'
import { isHashEmpty, parseHash, stringifyHash } from '../../helpers/searchHash'
import * as store from '../../store'
import TokenContainer from '../token/TokenContainer'

const NoTokensContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const SearchResults = () => {
  const router = useRouter()
  const location = useLocation()
  const current = useRecoilValue(store.searchResults)
  const { results, initialized, total } = current
  const fetchSearchResults = store.useFetchSearchResults()
  const fetchMoreSearchResults = store.useFetchMoreSearchResults()
  const searchQueryValid = useRecoilValue(store.searchQueryValid)
  const bootstrapSearchQuery = store.useBootstrapSearchQuery()
  const setSelectedSort = store.useSetSelectedSort()
  const selectedSort = useRecoilValue(store.searchSortSelected)
  const { selectedIndex } = useRecoilValue(store.searchSort)
  const [didMount, setDidMount] = useState(false)

  const updateFromHash = useCallback(() => {
    const payload = parseHash()
    bootstrapSearchQuery(payload.query)

    if (typeof payload.sortIdx === 'number' && !isNaN(payload.sortIdx)) {
      setSelectedSort(payload.sortIdx)
    }
  }, [])

  useEffect(() => {
    if (isHashEmpty()) {
      fetchSearchResults(searchQueryValid, selectedSort.sort)
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
        hash: stringifyHash(searchQueryValid, selectedIndex),
      })

      fetchSearchResults(searchQueryValid, selectedSort.sort)
    }
  }, [searchQueryValid, selectedSort.sort])

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
