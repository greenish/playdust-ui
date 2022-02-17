import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ExplorerContainer, ExplorerHeader } from '../../components/explorer'

const Program: NextPage = () => {
  const router = useRouter()

  const accountId = router.query.id as string

  return <ProgramPage accountId={accountId} />
}

interface ProgramPageProps {
  accountId: string
}

const ProgramPage = ({ accountId }: ProgramPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Program" filter="program" value={accountId} />
    </ExplorerContainer>
  )
}

export default Program
