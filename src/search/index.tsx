import styled from '@emotion/styled'
import { useEffect } from 'react'
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'
import type WindowProps from '../app/types/WindowProps'
import FlaggedModal from './components/FlaggedModal'
import SearchOverview from './components/SearchOverview'
import SearchResults from './components/SearchResults'
import SearchSideBar from './components/SearchSideBar'
import parseSearch from './helpers/parseSearch'
import { serializeSearchActual } from './helpers/serializeSearch'
import useUpdateSearch, { useResetSearch } from './hooks/useUpdateSearch'
import * as store from './store'

const RootContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

const RightContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
  flex-direction: column;
  margin-left: 16px;
`

const TokenContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

const Search = ({ state, clearState, setWindowImages }: WindowProps) => {
  const sortOptions = useRecoilValue(store.searchSortOptions)
  const setSearchKey = useSetRecoilState(store.searchKey)
  const updateSearch = useUpdateSearch()
  const resetSearch = useResetSearch()
  const searchResults = useRecoilValueLoadable(store.searchResults)

  useEffect(() => {
    try {
      const parsed = parseSearch(state)
      updateSearch(parsed)

      const actual = {
        ...parsed,
        sort: parsed.sort || sortOptions[0].value,
      }

      const serialized = serializeSearchActual(actual)

      setSearchKey(serialized)
    } catch (e) {
      console.error(e)
      clearState()
    }

    return () => resetSearch()
  }, [])

  useEffect(() => {
    if (
      searchResults.state === 'hasValue' &&
      searchResults.contents.total > 0
    ) {
      const filtered = searchResults.contents.nfts
        .filter((nft) => nft.offChainData.image)
        .slice(0, 4)
        .map((nft) => nft.offChainData.image)

      if (filtered.length) {
        setWindowImages(filtered)
      }
    }
  }, [searchResults])

  return (
    <>
      <RootContainer>
        <SearchSideBar />
        <RightContainer>
          <SearchOverview />
          <TokenContainer>
            <SearchResults />
          </TokenContainer>
        </RightContainer>
      </RootContainer>
      <FlaggedModal />
    </>
  )
}

export default Search
