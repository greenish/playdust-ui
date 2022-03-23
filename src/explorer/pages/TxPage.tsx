import { getSearchType } from '../../../helpers/routing'
import {
  AccountInputs,
  ErrorCard,
  ExplorerContainer,
  ExplorerHeader,
  InstructionDetails,
  ProgramLog,
  TransactionOverview,
} from '../components'

interface TxPageProps {
  signature: string
}

export const TxPage = ({ signature }: TxPageProps) => {
  const content = (() => {
    if (getSearchType(signature) !== 'tx') {
      return <ErrorCard message={`Signature "${signature}" is not valid`} />
    }

    return (
      <>
        <TransactionOverview signature={signature} />
        <AccountInputs signature={signature} />
        <InstructionDetails signature={signature} />
        <ProgramLog signature={signature} />
      </>
    )
  })()

  return (
    <ExplorerContainer>
      <ExplorerHeader label="Transaction" filter="tx" value={signature} />
      {content}
    </ExplorerContainer>
  )
}
