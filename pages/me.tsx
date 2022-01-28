import styled from '@emotion/styled'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Suspense } from 'react'
import OwnedTokens from '../components/token/OwnedTokens'

const ParentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

const Me = () => {
  const wallet = useWallet()

  return (
    <ParentContainer>
      <WalletMultiButton />
      {wallet.connected && wallet.publicKey && (
        <Suspense fallback={<div />}>
          <OwnedTokens publicKey={wallet.publicKey} />
        </Suspense>
      )}
    </ParentContainer>
  )
}

export default Me
