import { isAddressTx } from '../../../helpers/utils'
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
