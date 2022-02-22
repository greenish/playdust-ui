import styled from '@emotion/styled'
import { Card, CardContent, Container, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { cannedCollections } from '../solana'
import * as store from '../store'

const IndexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-top: 4;
  padding-bottom: 4;
`

const Home: NextPage = () => {
  const router = useRouter()
  const initCollectionQuery = store.useInitializeCollectionQuery()

  return (
    <Container>
      <IndexContainer>
        {cannedCollections.map(({ image, ...collection }) => (
          <Card
            key={collection.symbol}
            onClick={() => {
              initCollectionQuery(collection)

              router.push({
                pathname: '/search',
              })
            }}
            sx={{
              cursor: 'pointer',
              m: 2,
            }}
          >
            <img alt={collection.name} src={image} width={300} />
            <CardContent>
              <Typography>
                {collection.name} ({collection.symbol})
              </Typography>
            </CardContent>
          </Card>
        ))}
      </IndexContainer>
    </Container>
  )
}

export default Home
