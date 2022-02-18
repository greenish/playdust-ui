import { CircularProgress } from '@mui/material'
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

  const accountId = query.id as string

  if (!isReady) {
    return <div />
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <AccountPage accountId={accountId} />
    </Suspense>
  )
}

interface AccountPageProps {
  accountId: string
}

const AccountPage = ({ accountId }: AccountPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Account" filter="account" value={accountId} />
      <AccountOverview pubkey={accountId} />
      <AccountDetails pubkey={accountId} />
    </ExplorerContainer>
  )
}

export default Account
