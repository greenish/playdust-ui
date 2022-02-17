import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ExplorerContainer, ExplorerHeader } from '../../components/explorer'

const Tx: NextPage = () => {
  const router = useRouter()

  const txId = router.query.id as string

  return <TxPage txId={txId} />
}

interface TxPageProps {
  txId: string
}

const TxPage = ({ txId }: TxPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Transaction" filter="tx" value={txId} />
    </ExplorerContainer>
  )
}

export default Tx
