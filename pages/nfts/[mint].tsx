import styled from '@emotion/styled'
import { CircularProgress, Container } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import Details from '../../components/nft/Details'
import Orders from '../../components/nft/Orders'
import TransactionHistory from '../../components/nft/TransactionHistory'

const PageContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
`

const Nft: NextPage = () => {
  const router = useRouter()

  if (!router.isReady) {
    return <div />
  }

  const mint = router.query.mint as string

  return (
    <PageContainer>
      <Suspense fallback={<CircularProgress />}>
        <Details mint={mint} />
      </Suspense>
      <TransactionHistory mint={mint} />
      <Orders mint={mint} />
    </PageContainer>
  )
}

export default Nft
