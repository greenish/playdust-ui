import styled from '@emotion/styled'
import { Container } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Details from '../../components/nft/Details'
import TradingModule from '../../components/nft/TradingModule'
import TransactionHistory from '../../components/nft/TransactionHistory'

const PageContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
`

const Nft: NextPage = () => {
  const router = useRouter()

  return (
    <PageContainer>
      <Details mint={String(router.query.id)} />
      <TransactionHistory mint={String(router.query.id)} />
      <TradingModule id={String(router.query.id)} />
    </PageContainer>
  )
}

export default Nft
