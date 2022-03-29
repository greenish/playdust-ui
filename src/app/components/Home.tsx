import styled from '@emotion/styled'
import { Card, CardContent, Container, Typography } from '@mui/material'
import useSyncSerializedSearch from '../../search/hooks/useSyncSerializedSearch'
import * as searchStore from '../../search/store'
import testCollections from '../../search/testCollections'
import type WindowProps from '../types/WindowProps'

const IndexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-top: 4;
  padding-bottom: 4;
`

const Home = ({ addTab }: WindowProps) => {
  const initCollection = searchStore.useInitializeCollectionQuery()

  useSyncSerializedSearch(addTab)

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
