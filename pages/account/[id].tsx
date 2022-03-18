import { CircularProgress } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { AccountPage } from '../../src/explorer/pages/AccountPage'

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

export default Account
