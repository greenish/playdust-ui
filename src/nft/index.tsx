import styled from '@emotion/styled'
import { Container } from '@mui/material'
import Details from './components/Details'
import Orders from './components/Orders'
import TransactionHistory from './components/TransactionHistory'

const PageContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
`

interface NftProps {
  mint: string
}

const Nft = ({ mint }: NftProps) => {
  return (
    <PageContainer>
      <Details mint={mint} />
      <TransactionHistory mint={mint} />
      <Orders mint={mint} />
    </PageContainer>
  )
}

export default Nft
