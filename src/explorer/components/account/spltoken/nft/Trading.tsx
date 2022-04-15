import { CircularProgress, Typography } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import React, { Suspense } from 'react'
import Status from '../../../../../common/types/Status'
import TradeNFT from './TradeNFT'

type TokenOverviewProps = {
  pubkey: PublicKey
  status: Status
}

export const Trading = ({ pubkey, status }: TokenOverviewProps) => {
  const { publicKey: walletPublicKey } = useWallet()

  if (!walletPublicKey) {
    return null
  }

  return (
    <>
      {status === Status.Censored ? (
        <>
          <Typography color="error" variant="h5">
            NFT censored
          </Typography>
          <Typography color="#757575">Trading not available</Typography>
        </>
      ) : (
        <Suspense fallback={<CircularProgress />}>
          <TradeNFT mint={pubkey.toBase58()} publicKey={walletPublicKey} />
        </Suspense>
      )}
    </>
  )
}
