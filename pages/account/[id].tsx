import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ExplorerContainer, ExplorerHeader } from '../../components/explorer'

const Account: NextPage = () => {
  const router = useRouter()

  const accountId = router.query.id as string

  return <AccountPage accountId={accountId} />
}

interface AccountPageProps {
  accountId: string
}

const AccountPage = ({ accountId }: AccountPageProps) => {
  return (
    <ExplorerContainer>
      <ExplorerHeader label="Account" filter="account" value={accountId} />
    </ExplorerContainer>
  )
}

export default Account
