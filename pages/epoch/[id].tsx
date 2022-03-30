import { CircularProgress } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { EpochPage } from '../../src/explorer/pages/EpochPage'

const Epoch: NextPage = () => {
  const { isReady, query } = useRouter()

  const epoch = query.id as string

  if (!isReady) {
    return <div />
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <EpochPage epoch={Number(epoch)} />
    </Suspense>
  )
}
export default Epoch
