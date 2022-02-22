import styled from '@emotion/styled'
import { CircularProgress, Divider } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import AttributeFilters from '../components/search/AttributeFilters'
import SearchInput from '../components/search/SearchInput'
import SearchResults from '../components/search/SearchResults'
import SortFields from '../components/search/SortFields'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
`

const LeftContainer = styled.div`
  width: 300px;
  margin-right: 8px;
  margin-left: 16px;
`

const BottomContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const SearchInputContainer = styled.div`
  margin-right: 16px;
  width: 100%;
`

const TokenContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: scroll;
`

const DividerContainer = styled(Divider)`
  margin: 8px 16px;
`

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Search: NextPage = () => {
  return (
    <RootContainer>
      <TopContainer>
        <LeftContainer>
          <SortFields />
        </LeftContainer>
        <SearchInputContainer>
          <SearchInput />
        </SearchInputContainer>
      </TopContainer>
      <DividerContainer />
      <BottomContainer>
        <Suspense
          fallback={
            <SpinnerContainer>
              <CircularProgress />
            </SpinnerContainer>
          }
        >
          <LeftContainer>
            <AttributeFilters />
          </LeftContainer>
          <TokenContainer>
            <SearchResults />
          </TokenContainer>
        </Suspense>
      </BottomContainer>
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
