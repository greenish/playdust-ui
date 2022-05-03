import getWindowType from '../../App/_helpers/getWindowType'
import WindowProps from '../../App/_types/WindowPropsType'
import {
  ErrorCard,
  ExplorerContainer,
  ExplorerHeader,
} from '../components/common'
import {
  AccountInputs,
  InstructionDetails,
  ProgramLog,
  TransactionOverview,
} from '../components/transaction'

export const TxPage = ({ state }: WindowProps) => {
  const signature = state
  const content = (() => {
    if (getWindowType(signature) !== 'tx') {
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
    <ExplorerContainer filter="tx" value={signature}>
      <ExplorerHeader label="Transaction" />
      {content}
    </ExplorerContainer>
  )
}
