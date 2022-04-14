import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import type WindowProps from '../app/types/WindowProps'
import CollectionResults from './components/CollectionResults'
import FlaggedModal from './components/FlaggedModal'
import SearchResults from './components/SearchResults'
import SearchSideBar from './components/SearchSideBar'
import parseSearch from './helpers/parseSearch'
import { serializeSearchActual } from './helpers/serializeSearch'
import useUpdateSearch from './hooks/useUpdateSearch'
import * as store from './store'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const TokenContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

const ResultsContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
`

const Search = ({ state, removeTab }: WindowProps) => {
  const sortOptions = useRecoilValue(store.searchSortOptions)
  const setSearchKey = useSetRecoilState(store.searchKey)
  const updateSearch = useUpdateSearch()

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
      removeTab()
    }
  }, [])

  return (
    <>
      <RootContainer>
        <CollectionResults />
        <ResultsContainer>
          <SearchSideBar />
          <TokenContainer>
            <SearchResults />
          </TokenContainer>
        </ResultsContainer>
      </RootContainer>
      <FlaggedModal />
    </>
  )
}

export default Search
