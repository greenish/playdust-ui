import styled from '@emotion/styled'
import { Card, CardContent, Container, Typography } from '@mui/material'
import useSyncSerializedSearchUrl from '../../search/hooks/useSyncSerializedSearchUrl'
import * as searchStore from '../../search/store'
import testCollections from '../../search/testCollections'

const IndexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-top: 4;
  padding-bottom: 4;
`

const Home = () => {
  const initCollection = searchStore.useInitializeCollectionQuery()

  useSyncSerializedSearchUrl()

  return (
    <Container>
      <IndexContainer>
        {testCollections.map((collection) => (
          <Card
            key={collection.id}
            onClick={() => {
              initCollection(collection.id)
            }}
            sx={{
              cursor: 'pointer',
              m: 2,
              width: '100%',
            }}
          >
            <CardContent>
              <Typography>{collection.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </IndexContainer>
    </Container>
  )
}

export default Home
