import WindowProps from '../../App/Window/_types/WindowPropsType'
import getWindowType from '../../App/Window/WindowInput/_helpers/getWindowType'
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
