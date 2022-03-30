import WindowProps from '../../app/types/WindowProps'
import {
  BlockDetails,
  BlockOverview,
  ExplorerContainer,
  ExplorerHeader,
} from '../components'

export const BlockPage = ({ state }: WindowProps) => {
  const slot = Number(state)

  return (
    <ExplorerContainer filter="block" value={slot.toString()}>
      <ExplorerHeader label="Block" />
      <BlockOverview slot={slot} />
      <BlockDetails slot={slot} />
    </ExplorerContainer>
  )
}
