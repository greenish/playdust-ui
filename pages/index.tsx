import styled from '@emotion/styled'
import { Card, CardContent, Container, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import * as searchStore from '../src/search/store'
import testCollections from '../src/search/testCollections'

const IndexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-top: 4;
  padding-bottom: 4;
`

const Home: NextPage = () => {
  const router = useRouter()
  const initCollection = searchStore.useInitializeCollectionQuery()

  return (
    <Container>
      <IndexContainer>
        {testCollections.map((collection) => (
          <Card
            key={collection.id}
            onClick={() => {
              initCollection(collection.id)

              router.push({
                pathname: '/search',
              })
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
