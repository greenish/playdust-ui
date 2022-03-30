import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { Suspense, useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import FlaggedModal from '../../components/utils/FlaggedModal'
import type WindowProps from '../app/types/WindowProps'
import CollectionResults from './components/CollectionResults'
import SearchResults from './components/SearchResults'
import SearchSideBar from './components/SearchSideBar'
import useSyncSerializedSearch from './hooks/useSyncSerializedSearch'
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

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`

const ResultsContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
`

const Search = ({ setState, state }: WindowProps) => {
  const setQuery = store.useSetSearchQuery()
  const setSelectedSort = store.useSetSelectedSort()
  const setOnlyListed = useSetRecoilState(store.searchOnlyListed)
  const id = useRecoilValue(store.flaggedId)
  const [open, setOpen] = useRecoilState(store.flaggedModal)

  useSyncSerializedSearch(setState)

  useEffect(() => {
    if (state !== '') {
      try {
        const { query, sort, onlyListed } = JSON.parse(state)

        setQuery(query)
        setSelectedSort(sort)
        setOnlyListed(onlyListed)
      } catch (e) {
        setState('')
      }
    }
  }, [])

  return (
    <RootContainer>
      <Suspense
        fallback={
          <SpinnerContainer>
            <CircularProgress />
          </SpinnerContainer>
        }
      >
        <CollectionResults />
        <ResultsContainer>
          <SearchSideBar />
          <TokenContainer>
            <SearchResults />
          </TokenContainer>
        </ResultsContainer>
      </Suspense>
      <FlaggedModal open={open} setOpen={setOpen} id={id} type="Collection" />
    </RootContainer>
  )
}

export default Search
