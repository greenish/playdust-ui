import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import {
  BlockDetails,
  BlockOverview,
  ExplorerContainer,
  ExplorerHeader,
} from '../../components/explorer'
import { useBlock } from '../../store'

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

interface BlockPageProps {
  slot: number
}

const BlockPage = ({ slot }: BlockPageProps) => {
  const block = useBlock(slot)

  return (
    <ExplorerContainer>
      <ExplorerHeader label="Block" filter="block" value={slot.toString()} />
      <BlockOverview slot={slot} />
      <BlockDetails slot={slot} />
    </ExplorerContainer>
  )
}

export default Block
