import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
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

const Search = ({ state, clearState }: WindowProps) => {
  const sortOptions = useRecoilValue(store.searchSortOptions)
  const setSearchKey = useSetRecoilState(store.searchKey)
  const updateSearch = useUpdateSearch()
  const resetSearch = useResetSearch()

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
