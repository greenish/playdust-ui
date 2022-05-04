import WindowProps from '../../App/Window/_types/WindowPropsType'
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
