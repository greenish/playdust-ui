import getWindowType from '../../app/helpers/getWindowType'
import WindowProps from '../../app/types/WindowProps'
import {
  AccountInputs,
  ErrorCard,
  ExplorerContainer,
  ExplorerHeader,
  InstructionDetails,
  ProgramLog,
  TransactionOverview,
} from '../components'

export const TxPage = ({ state }: WindowProps) => {
  const signature = state
  const content = (() => {
    if (getWindowType(signature) !== 'transaction') {
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
