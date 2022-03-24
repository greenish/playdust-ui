import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-use'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isHashEmpty, parseHash } from '../helpers/searchHash'
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
  const [didMount, setDidMount] = useState(false)
  const current = useRecoilValue(store.searchResults)
  const searchHash = useRecoilValue(store.searchHash)
  const fetchSearchResults = store.useFetchSearchResults()
  const fetchMoreSearchResults = store.useFetchMoreSearchResults()
  const bootstrapSearchQuery = store.useBootstrapSearchQuery()
  const setSelectedSort = store.useSetSelectedSortByValue()
  const setOnlyListed = useSetRecoilState(store.searchOnlyListed)

  const updateFromHash = useCallback(() => {
    const payload = parseHash()
    bootstrapSearchQuery(payload.query)
    setSelectedSort(payload.sort)
    setOnlyListed(payload.onlyListed)
  }, [])

  useEffect(() => {
    if (isHashEmpty()) {
      if (searchHash.length > 0) {
        router.replace({
          pathname: router.pathname,
          hash: searchHash,
        })
      }

      fetchSearchResults()
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

  useEffect(() => {
    if (didMount) {
      router.push({
        pathname: router.pathname,
        hash: searchHash,
      })

      fetchSearchResults()
    }
  }, [searchHash])

  const { nfts, initialized, total } = current

  if (initialized && nfts.length === 0) {
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
        return fetchMoreSearchResults(current)
      }}
    />
  )
}

export default SearchResults
