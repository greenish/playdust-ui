import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import CollectionResults from './components/CollectionResults'
import SearchInput from './components/SearchInput'
import SearchResults from './components/SearchResults'
import SearchSideBar from './components/SearchSideBar'
import * as store from './store'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const SearchInputContainer = styled.div`
  padding: 8px 16px;
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

const Search: NextPage = () => {
  const { initialized } = useRecoilValue(store.searchResults)

  return (
    <RootContainer>
      <SearchInputContainer>
        <SearchInput />
        {!initialized && (
          <SpinnerContainer>
            <CircularProgress />
          </SpinnerContainer>
        )}
      </SearchInputContainer>
      <CollectionResults />
      <ResultsContainer>
        <SearchSideBar />
        <TokenContainer>
          <SearchResults />
        </TokenContainer>
      </ResultsContainer>
    </RootContainer>
  )
}

const Page = () => {
  const { isReady } = useRouter()

  if (!isReady) {
    return <div />
  }

  return <Search />
}

export default Page
