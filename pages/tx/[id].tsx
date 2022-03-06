import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import {
  AccountInputs,
  ExplorerContainer,
  ExplorerHeader,
  InstructionDetails,
  ProgramLog,
  TransactionOverview,
} from '../../components/explorer'

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

interface TxPageProps {
  signature: string
}

const TxPage = ({ signature }: TxPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Transaction" filter="tx" value={signature} />
      <TransactionOverview signature={signature} />
      <AccountInputs signature={signature} />
      <InstructionDetails signature={signature} />
      <ProgramLog signature={signature} />
    </ExplorerContainer>
  )
}

export default Tx
