import styled from '@emotion/styled'
import { Card, CardContent, Typography } from '@mui/material'
import { useRecoilValue } from 'recoil'
import * as store from '../store'

const cardSize = 250
const topSpace = 8
const bottomSpace = 16
const totalHeight = cardSize + topSpace + bottomSpace

const RootContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding-top: ${topSpace}px;
  margin-bottom: ${bottomSpace}px;
  padding-left: 16px;
  min-height: ${totalHeight}px;
  overflow-x: scroll;
`

const CollectionResults = () => {
  const { collections } = useRecoilValue(store.searchResults)
  const { results } = collections
  const initCollectionQuery = store.useInitializeCollectionQuery()

  if (results.length === 0) {
    return <></>
  }

  return (
    <RootContainer>
      {results
        .filter((collection) => !!collection.name)
        .map((collection) => (
          <Card
            key={collection.id}
            sx={{
              height: cardSize,
              minWidth: cardSize,
              mr: 2,
              cursor: 'pointer',
            }}
            onClick={() => initCollectionQuery(collection.id)}
          >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography sx={{ fontSize: 14 }}>{collection.name}</Typography>
            </CardContent>
          </Card>
        ))}
    </RootContainer>
  )
}

export default CollectionResults
