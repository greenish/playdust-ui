import styled from '@emotion/styled'
import { Card, CardContent, Container, Typography } from '@mui/material'
import useOnChangeSerializedSearch from '../../search/hooks/useOnChangeSerializedSearch'
import * as searchStore from '../../search/store'
import testCollections from '../../search/testCollections'
import WindowProps from '../types/WindowProps'

const IndexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-top: 4;
  padding-bottom: 4;
`

const Home = ({ addTab }: WindowProps) => {
  const initCollection = searchStore.useInitializeCollectionQuery()

  useOnChangeSerializedSearch((nextState: string) =>
    addTab({
      type: 'search',
      state: nextState,
    })
  )

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
