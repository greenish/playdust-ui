import styled from '@emotion/styled'
import { Close } from '@mui/icons-material'
import { Card, CardContent, IconButton, Typography } from '@mui/material'
import { NodeComponentProps } from 'react-flow-renderer'
import { useRecoilValue } from 'recoil'
import * as store from '../../store'
import SearchHandles from './SearchHandles'
import SearchValue from './SearchValue'

const CloseContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
`

const SearchNode = ({ id, data }: NodeComponentProps) => {
  const removeChild = store.useRemoveChild()
  const query = useRecoilValue(store.searchQueryChild(id))

  if (!query) {
    return <></>
  }

  return (
    <>
      <Card sx={{ width: data.width, height: data.height }}>
        <CardContent>
          <CloseContainer>
            <Typography>{query.field}</Typography>
            <IconButton size="small" onClick={() => removeChild(id)}>
              <Close fontSize="small" />
            </IconButton>
          </CloseContainer>
          <SearchValue id={id} />
        </CardContent>
      </Card>
      <SearchHandles />
    </>
  )
}

export default SearchNode
