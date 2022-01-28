import type { NextPage } from 'next'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { MetaplexCollectionIdentifier } from '../solana/types'
import CollectionContainer from '../components/collection/CollectionContainer'
import CollectionFilters from '../components/collection/CollectionFilters'
import { collectionIdentifier } from '../store'
import { useRecoilState } from 'recoil'

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

const FilterContainer = styled.div`
  display: flex;
  width: 300px;
  padding: 16px;
`

const TokenFlexContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const CollectionNameContainer = styled.div`
  display: flex;
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
        <CollectionNameContainer>
          <Typography variant="h3">{identifier.name}</Typography>
        </CollectionNameContainer>
        <Suspense fallback={<div />}>
          <RootContainer>
            <FilterContainer>
              <CollectionFilters />
            </FilterContainer>
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
