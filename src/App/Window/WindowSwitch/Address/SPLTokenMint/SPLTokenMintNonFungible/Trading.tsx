import React from 'react';
/*
import { CircularProgress, Typography } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import React, { Suspense } from 'react'
import Status from '../../../../../App/_types/StatusEnumType'
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
*/

function Trading() {
    return null;
}

export default Trading;
