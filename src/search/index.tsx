import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import type WindowProps from '../app/types/WindowProps'
import CollectionResults from './components/CollectionResults'
import FlaggedModal from './components/FlaggedModal'
import SearchResults from './components/SearchResults'
import SearchSideBar from './components/SearchSideBar'
import useSyncSerializedSearchUrl from './hooks/useSyncSerializedSearchUrl'
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
  const setQuery = store.useSetSearchQuery()
  const setSelectedSort = store.useSetSelectedSort()
  const setOnlyListed = useSetRecoilState(store.searchOnlyListed)

  useSyncSerializedSearchUrl()

  useEffect(() => {
    try {
      const { query, sort, onlyListed } = JSON.parse(state)

      setQuery(query)
      setSelectedSort(sort)
      setOnlyListed(onlyListed)
    } catch (e) {
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
