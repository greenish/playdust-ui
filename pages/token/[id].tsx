import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ExplorerContainer, ExplorerHeader } from '../../components/explorer'

const Token: NextPage = () => {
  const router = useRouter()

  const tokenId = router.query.id as string

  return <TokenPage tokenId={tokenId} />
}

interface TokenPageProps {
  tokenId: string
}

const TokenPage = ({ tokenId }: TokenPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Token" filter="token" value={tokenId} />
    </ExplorerContainer>
  )
}

export default Token
