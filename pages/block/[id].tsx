import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ExplorerContainer, ExplorerHeader } from '../../components/explorer'

const Block: NextPage = () => {
  const router = useRouter()

  const slot = router.query.id as string

  return <BlockPage slot={slot} />
}

interface BlockPageProps {
  slot: string
}

const BlockPage = ({ slot }: BlockPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Block" filter="block" value={slot} />
    </ExplorerContainer>
  )
}

export default Block
