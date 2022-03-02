import { CircularProgress } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { Suspense } from 'react'
import { ExplorerContainer, ExplorerHeader } from '../../components/explorer'
import { TokenDetails } from '../../components/explorer/TokenDetails'
import { TokenOverview } from '../../components/explorer/TokenOverview'

const Token: NextPage = () => {
  const router = useRouter()

  const tokenId = router.query.id as string

  if (!router.isReady) {
    return <div />
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <TokenPage tokenId={tokenId} />
    </Suspense>
  )
}

interface TokenPageProps {
  tokenId: string
}

const TokenPage = ({ tokenId }: TokenPageProps) => {
  let pubkey: PublicKey | undefined

  try {
    pubkey = new PublicKey(tokenId)
  } catch (err) {}

  return (
    <ExplorerContainer>
      <ExplorerHeader label="Token" filter="token" value={tokenId} />
      {pubkey ? (
        <>
          <TokenOverview pubkey={pubkey} />
          <TokenDetails pubkey={pubkey} />
        </>
      ) : (
        <div>Invalid ID</div>
      )}
    </ExplorerContainer>
  )
}

export default Token
