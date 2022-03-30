import { EpochOverview, ExplorerContainer, ExplorerHeader } from '../components'

interface EpochPageProps {
  epoch: number
}

export const EpochPage = ({ epoch }: EpochPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Epoch" filter="epoch" value={epoch.toString()} />
      <EpochOverview epoch={epoch} />
    </ExplorerContainer>
  )
}
