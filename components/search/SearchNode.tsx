import styled from '@emotion/styled'
import { Close } from '@mui/icons-material'
import { Card, CardContent, IconButton, Typography } from '@mui/material'
import { CSSProperties } from 'react'
import { Handle, NodeComponentProps, Position } from 'react-flow-renderer'
import { useRecoilValue } from 'recoil'
import * as store from '../../store'
import SearchValue from './SearchValue'

const CloseContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
`

const getStyle = (show: boolean): Partial<CSSProperties> => ({
  visibility: show ? 'visible' : 'hidden',
})

const SearchNode = ({ id, data }: NodeComponentProps) => {
  const removeChild = store.useRemoveChild()
  const query = useRecoilValue(store.searchQueryChild(id))
  const handles = data?.handles || {}

  if (!query) {
    return <></>
  }

  return (
    <>
      <Card sx={{ width: data.width, height: data.height }}>
        <CardContent>
          <CloseContainer>
            <Typography>{query.field}</Typography>
            {!query.locked && (
              <IconButton size="small" onClick={() => removeChild(id)}>
                <Close fontSize="small" />
              </IconButton>
            )}
          </CloseContainer>
          <SearchValue id={id} />
        </CardContent>
      </Card>
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={getStyle(handles.top)}
      />
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={getStyle(handles.right)}
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        style={getStyle(handles.bottom)}
      />
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={getStyle(handles.left)}
      />
    </>
  )
}

export default SearchNode
