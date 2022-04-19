import styled from '@emotion/styled'
import { Divider } from '@mui/material'
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
  return (
    <RootContainer>
      <SortContainer>
        <SortFields />
      </SortContainer>
      <OnlyListedSwitch />
      <RangeFilters />
      <br />
      <Divider />
      <AttributeFilters />
    </RootContainer>
  )
}

export default SearchSideBar
