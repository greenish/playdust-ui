import styled from '@emotion/styled'
import { Container, Divider, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import CollectionContainer from '../components/collection/CollectionContainer'
import CollectionFilters from '../components/collection/CollectionFilters'
import SortFields from '../components/collection/SortFields'
import SearchInput from '../components/search/SearchInput'
import { MetaplexCollectionIdentifier } from '../solana/types'
import * as store from '../store'

const RootContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  margin-bottom: 16px;
  width: 300px;
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const SearchInputContainer = styled.div`
  margin-right: 16px;
`

const TokenContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  margin-top: 16px;
`

const DividerContainer = styled(Divider)`
  width: 100%;
  margin-top: 16px;
  margin-bottom: 8px;
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
  const [identifier, setCollectionIdentifier] = useRecoilState(
    store.collectionIdentifier
  )
  const initCollectionQuery = store.useInitializeCollectionQuery()
  const searchQuery = useRecoilValue(store.searchQuery)

  useEffect(() => {
    if (isReady) {
      const serialized = serializeSearchParam(query)
      const rootQueryValue = searchQuery[0]?.[0]?.value

      if (rootQueryValue !== serialized.name) {
        initCollectionQuery(serialized.name as string)
      }

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
      <Suspense fallback={<div />}>
        <RootContainer>
          <LeftContainer>
            <SortFields />
            <DividerContainer />
            <CollectionFilters />
          </LeftContainer>
          <RightContainer>
            <SearchInputContainer>
              <SearchInput />
            </SearchInputContainer>
            <TokenContainer>
              <CollectionContainer />
            </TokenContainer>
          </RightContainer>
        </RootContainer>
      </Suspense>
    )
  )
}

export default Collection
