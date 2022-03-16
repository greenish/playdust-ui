import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import {
  AccountInputs,
  ErrorCard,
  ExplorerContainer,
  ExplorerHeader,
  InstructionDetails,
  ProgramLog,
  TransactionOverview,
} from '../../components/explorer'
import { isAddressTx } from '../../helpers/utils'

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
  const content = isAddressTx(signature) ? (
    <>
      <TransactionOverview signature={signature} />
      <AccountInputs signature={signature} />
      <InstructionDetails signature={signature} />
      <ProgramLog signature={signature} />
    </>
  ) : (
    <ErrorCard message={`Signature "${signature}" is not valid`} />
  )

  return (
    <ExplorerContainer>
      <ExplorerHeader label="Transaction" filter="tx" value={signature} />
      {content}
    </ExplorerContainer>
  )
}

export default Tx
