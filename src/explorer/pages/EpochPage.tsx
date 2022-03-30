import WindowProps from '../../app/types/WindowProps'
import { EpochOverview, ExplorerContainer, ExplorerHeader } from '../components'

export const EpochPage = ({ state }: WindowProps) => {
  const epoch = Number(state)

  return (
    <ExplorerContainer filter="epoch" value={epoch.toString()}>
      <ExplorerHeader label="Epoch" />
      <EpochOverview epoch={epoch} />
    </ExplorerContainer>
  )
}
