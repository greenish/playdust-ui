import { CircularProgress } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import {
  AccountDetails,
  AccountOverview,
  ExplorerContainer,
  ExplorerHeader,
} from '../../components/explorer'

const Account: NextPage = () => {
  const { isReady, query } = useRouter()

  const address = query.id as string

  if (!isReady) {
    return <div />
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <AccountPage address={address} />
    </Suspense>
  )
}

interface AccountPageProps {
  address: string
}

const AccountPage = ({ address }: AccountPageProps) => {
  let pubkey: PublicKey | undefined

  try {
    pubkey = new PublicKey(address)
  } catch (err) {}

  return (
    <ExplorerContainer>
      <ExplorerHeader label="Account" filter="account" value={address} />
      {pubkey ? (
        <>
          <AccountOverview pubkey={pubkey} />
          <AccountDetails pubkey={pubkey} />
        </>
      ) : (
        <div>Invalid address</div>
      )}
    </ExplorerContainer>
  )
}

export default Account
