import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { getSpace } from '../../../helpers/account'
import compact from '../../../helpers/compact'
import { useAccountInfo } from '../../../store'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  SolBalance,
} from '../../common'
import { AccountDetails } from '../AccountDetails'

interface ProgramBufferAccountInfo {
  authority?: string
}

interface UpgradeableLoaderAccountProps {
  pubkey: PublicKey
}

const UpgradeableProgramBufferContent = ({
  pubkey,
}: UpgradeableLoaderAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const accountData = account?.data as ParsedAccountData
  const programBuffer =
    (accountData.parsed?.info as ProgramBufferAccountInfo) || {}
  const details = account || {}

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} />],
    ['SOL Balance', <SolBalance lamports={account?.lamports || 0} />],
    ['Data (Bytes)', getSpace(account)],
    programBuffer.authority && [
      'Deploy Authority',
      <AccountLink to={programBuffer.authority} />,
    ],
    details && ['Owner', <AccountLink to={details.owner.toBase58()} />],
  ])

  return <ExplorerGrid rows={rows} />
}

export const UpgradeableProgramBuffer = (
  props: UpgradeableLoaderAccountProps
) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Program Deploy Buffer Account">
        <UpgradeableProgramBufferContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
