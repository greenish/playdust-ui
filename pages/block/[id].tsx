import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { BlockPage } from '../../src/explorer/pages/BlockPage'

const Block: NextPage = () => {
  const { isReady, query } = useRouter()

  const slot = query.id as string

  if (!isReady) {
    return <div />
  }

  return (
    <Suspense fallback={<div>Loading</div>}>
      <BlockPage slot={Number(slot)} />
    </Suspense>
  )
}
export default Block
