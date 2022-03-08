import styled from '@emotion/styled'
import { Close } from '@mui/icons-material'
import { Card, CardContent, IconButton, Typography } from '@mui/material'
import { CSSProperties } from 'react'
import { Handle, NodeComponentProps, Position } from 'react-flow-renderer'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import SearchValue from './SearchValue'

const CloseContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const getStyle = (show: boolean): Partial<CSSProperties> => ({
  visibility: show ? 'visible' : 'hidden',
})

const humanize = (value: string) =>
  value
    .match(/[A-Za-z][a-z]*/g)
    ?.map(
      ([firstLetter, ...rest]) => `${firstLetter.toUpperCase()}${rest.join('')}`
    )
    .join(' ')

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
        <CardContent sx={{ width: '100%', height: '100%' }}>
          <CloseContainer>
            <Typography>{humanize(query.field)}</Typography>
            <IconButton size="small" onClick={() => removeChild(id)}>
              <Close fontSize="small" />
            </IconButton>
          </CloseContainer>
          <ContentContainer>
            <SearchValue id={id} />
          </ContentContainer>
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
