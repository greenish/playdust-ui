import styled from '@emotion/styled'
import { Divider } from '@mui/material'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import AttributeFilters from './AttributeFilters'
import OnlyListedSwitch from './OnlyListedSwitch'
import RangeFilters from './RangeFilters'
import SortFields from './SortFields'

const RootContainer = styled.div`
  width: 300px;
  margin-right: 8px;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
`

const SortContainer = styled.div`
  padding: 8px 0;
`

const SearchSideBar = () => {
  const { initialized, nfts } = useRecoilValue(store.searchResults)

  if (!initialized || !nfts.length) {
    return <></>
  }

  return (
    <RootContainer>
      <SortContainer>
        <SortFields />
      </SortContainer>
      <Divider />
      <OnlyListedSwitch />
      <RangeFilters />
      <Divider />
      <AttributeFilters />
    </RootContainer>
  )
}

export default SearchSideBar
