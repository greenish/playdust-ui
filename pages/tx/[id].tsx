import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { TxPage } from '../../src/explorer/pages/TxPage'

const Tx: NextPage = () => {
  const { isReady, query } = useRouter()

  const signature = query.id as string

  if (!isReady) {
    return <div />
  }

  return (
    <Suspense fallback={<div>Loading</div>}>
      <TxPage signature={signature} />
    </Suspense>
  )
}

export default Tx
