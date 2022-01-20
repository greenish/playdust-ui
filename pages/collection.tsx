import type { NextPage } from 'next'
import {
  Suspense,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Typography,
} from '@mui/material'
import styled from '@emotion/styled'
import { MetaplexCollectionIdentifier } from '../solana/types'
import CollectionContainer from '../components/CollectionContainer'
import { collectionIdentifier } from '../store'
import { useRecoilState } from 'recoil'

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
`

const CollectionNameContainer = styled.div`
  display: flex;
`

const isValid = (input: any) =>
  typeof input === 'string' && !!input.length

export const serializeSearchParam = (searchParam: any): MetaplexCollectionIdentifier => {
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
  const [identifier, setCollectionIdentifier] = useRecoilState(collectionIdentifier)

  useEffect(() => {
    if (isReady) {
      const serialized = serializeSearchParam(query)

      setCollectionIdentifier(serialized)
    }
  }, [isReady, query])

  if (!isReady) {
    return <div />
  }

  if (identifier?.symbol === '') {
    return (
      <Container>
        <Typography variant="h3">
          Invalid Search Parameters
        </Typography>
      </Container>
    )
  }

  return identifier && (
    <AbsoluteContainer>
      <ParentContainer>
        <CollectionNameContainer>
          <Typography variant="h3">{identifier.name}</Typography>
        </CollectionNameContainer>
        <Suspense fallback={<div />}>
          <CollectionContainer />
        </Suspense>
      </ParentContainer>
    </AbsoluteContainer>
  )
}

export default Collection
