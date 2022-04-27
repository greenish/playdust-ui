import WindowProps from '../../app/types/WindowProps'
import { ExplorerContainer, ExplorerHeader } from '../components/common'
import { EpochOverview } from '../components/epoch'

export const EpochPage = ({ state }: WindowProps) => {
  const epoch = Number(state)

  return (
    <ExplorerContainer filter="epoch" value={epoch.toString()}>
      <ExplorerHeader label="Epoch" />
      <EpochOverview epoch={epoch} />
    </ExplorerContainer>
  )
}
