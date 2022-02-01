import styled from '@emotion/styled'
import { useWallet } from '@solana/wallet-adapter-react'
import { Suspense } from 'react'
import OwnedTokens from '../components/token/OwnedTokens'

const ParentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
`

const Me = () => {
  const wallet = useWallet()

  return (
    <ParentContainer>
      {wallet.connected && wallet.publicKey ? (
        <Suspense fallback={<div />}>
          <OwnedTokens publicKey={wallet.publicKey} />
        </Suspense>
      ) : (
        <i>Connect wallet to view tokens</i>
      )}
    </ParentContainer>
  )
}

export default Me
