import styled from '@emotion/styled'
import { Container, Divider, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import CollectionContainer from '../components/collection/CollectionContainer'
import CollectionFilters from '../components/collection/CollectionFilters'
import SortFields from '../components/collection/SortFields'
import { MetaplexCollectionIdentifier } from '../solana/types'
import { collectionIdentifier } from '../store'

const ParentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const AggregationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  padding: 0 16px 16px 16px;
`

const TokenFlexContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const DividerContainer = styled(Divider)`
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
`

const isValid = (input: any) => typeof input === 'string' && !!input.length

export const serializeSearchParam = (
  searchParam: any
): MetaplexCollectionIdentifier => {
  const { symbol, name, creator, updateAuthority } = searchParam

  const serialized: MetaplexCollectionIdentifier = {
    symbol: (isValid(symbol) && symbol) || '',
    name: isValid(name) && name,
    creator: isValid(creator) && creator,
    updateAuthority: isValid(updateAuthority) && updateAuthority,
  }

  return serialized
}

const Collection: NextPage = () => {
  const { isReady, query } = useRouter()
  const [identifier, setCollectionIdentifier] =
    useRecoilState(collectionIdentifier)

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
        <Typography variant="h3">Invalid Search Parameters</Typography>
      </Container>
    )
  }

  return (
    identifier && (
      <ParentContainer>
        <Suspense fallback={<div />}>
          <RootContainer>
            <AggregationContainer>
              <Typography>{identifier.name}</Typography>
              <DividerContainer />
              <SortFields />
              <DividerContainer />
              <CollectionFilters />
            </AggregationContainer>
            <TokenFlexContainer>
              <CollectionContainer />
            </TokenFlexContainer>
          </RootContainer>
        </Suspense>
      </ParentContainer>
    )
  )
}

export default Collection
