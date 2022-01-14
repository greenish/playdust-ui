import type { NextPage } from 'next'
import {
  Suspense,
  useMemo,
} from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  LinearProgress,
  Typography,
} from '@mui/material'
import styled from '@emotion/styled'
import { MetaplexCollectionIdentifier } from '../solana/types'
import CollectionContainer from '../components/CollectionContainer'

const AbsoluteContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

const ParentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const CollectionNameContainer = styled.div`
  display: flex;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const isValid = (input: any) =>
  typeof input === 'string' && !!input.length

const serializeSearchParam = (searchParam: any): MetaplexCollectionIdentifier => {
  const {
    symbol,
    name,
    creator,
    updateAuthority,
  } = searchParam

  const serialized: MetaplexCollectionIdentifier = {
    symbol: isValid(symbol) && symbol || '',
    name: isValid(name) && name,
    creator: isValid(creator) && creator,
    updateAuthority: isValid(updateAuthority) && updateAuthority,
  }

  return serialized
}

const Collection: NextPage = () => {
  const { isReady, query } = useRouter()

  const identifier = useMemo(() => {
    if (isReady) {
      return serializeSearchParam(query)
    }

    return { symbol: '' }
  }, [isReady, query])


  if (!isReady) {
    return <div />
  }

  if (identifier.symbol === '') {
    return (
      <Container>
        <Typography variant="h3">
          Invalid Search Parameters
        </Typography>
      </Container>
    )
  }

  return (
    <AbsoluteContainer>
      <ParentContainer>
        <CollectionNameContainer>
          <Typography variant="h3">{identifier.name}</Typography>
        </CollectionNameContainer>
        <Suspense
          fallback={
            <LoadingContainer>
              <Typography variant="h3">
                Loading onchain data...
              </Typography>
              <LinearProgress />
            </LoadingContainer>
          }
        >
          <CollectionContainer identifier={identifier} />
        </Suspense>
      </ParentContainer>
    </AbsoluteContainer>
  )
}

export default Collection
