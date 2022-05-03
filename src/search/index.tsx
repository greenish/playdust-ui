import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import type WindowProps from '../App/_types/WindowPropsType'
import FlaggedModal from './components/FlaggedModal'
import SearchOverview from './components/SearchOverview'
import SearchResults from './components/SearchResults'
import SearchSideBar from './components/SearchSideBar'
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

const Search = ({ setWindowImages }: WindowProps) => {
  const searchResults = useRecoilValueLoadable(store.searchResults)

  useEffect(() => {
    if (
      searchResults.state === 'hasValue' &&
      searchResults.contents.total > 0
    ) {
      const filtered = searchResults.contents.nfts
        .filter((nft) => nft?.offChainData?.image)
        .slice(0, 4)
        .map((nft) => nft?.offChainData?.image)

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
