import { CircularProgress } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import {
  AccountDetails,
  AccountOverview,
  ErrorCard,
  ExplorerContainer,
  ExplorerHeader,
} from '../../components/explorer'

const Address: NextPage = () => {
  const { isReady, query } = useRouter()

  const address = query.id as string

  if (!isReady) {
    return <div />
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <AddressPage address={address} />
    </Suspense>
  )
}

interface AddressPageProps {
  address: string
}

const AddressPage = ({ address }: AddressPageProps) => {
  let pubkey: PublicKey | undefined

  try {
    pubkey = new PublicKey(address)
  } catch (err) {}

  return (
    <ExplorerContainer>
      <ExplorerHeader label="Address" filter="account" value={address} />
      {pubkey ? (
        <>
          <AccountOverview pubkey={pubkey} />
          <AccountDetails pubkey={pubkey} />
        </>
      ) : (
        <ErrorCard message="Invalid address" />
      )}
    </ExplorerContainer>
  )
}

export default Address
