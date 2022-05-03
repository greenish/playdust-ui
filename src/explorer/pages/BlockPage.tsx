import WindowProps from '../../App/_types/WindowPropsType'
import { BlockDetails, BlockOverview } from '../components/block'
import { ExplorerContainer, ExplorerHeader } from '../components/common'

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
