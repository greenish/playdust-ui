import {
  BlockDetails,
  BlockOverview,
  ExplorerContainer,
  ExplorerHeader,
} from '../components'

interface BlockPageProps {
  slot: number
}

export const BlockPage = ({ slot }: BlockPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Block" filter="block" value={slot.toString()} />
      <BlockOverview slot={slot} />
      <BlockDetails slot={slot} />
    </ExplorerContainer>
  )
}
