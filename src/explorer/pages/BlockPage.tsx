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
    <ExplorerContainer>
      <ExplorerHeader label="Block" filter="block" value={slot.toString()} />
      <BlockOverview slot={slot} />
      <BlockDetails slot={slot} />
    </ExplorerContainer>
  )
}
