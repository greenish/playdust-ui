import WindowProps from '../../app/types/WindowProps'
import { EpochOverview, ExplorerContainer, ExplorerHeader } from '../components'

export const EpochPage = ({ state }: WindowProps) => {
  const epoch = Number(state)

  return (
    <ExplorerContainer>
      <ExplorerHeader label="Epoch" filter="epoch" value={epoch.toString()} />
      <EpochOverview epoch={epoch} />
    </ExplorerContainer>
  )
}
