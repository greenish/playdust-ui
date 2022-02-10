import styled from '@emotion/styled'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import SearchGraph from '../components/search/SearchGraph'

const RootContainer = styled.div`
  width: 100%;
  height: 100%;
`

const Search: NextPage = () => {
  const { isReady } = useRouter()

  if (!isReady) {
    return <div />
  }

  return (
    <RootContainer>
      <Suspense fallback={<div />}>
        <SearchGraph />
      </Suspense>
    </RootContainer>
  )
}

export default Search
