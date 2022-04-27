import { PublicKey } from '@solana/web3.js'
import { compact } from '../../../common/helpers/utils'
import { getSpace } from '../../helpers/account'
import { addressLabel, displayAddress } from '../../helpers/tx'
import { useAccountInfo, useSolanaCluster, useTokenRegistry } from '../../store'
import { AccountLink, ExplorerCard, ExplorerGrid, SolBalance } from '../common'
import { AccountDetails } from './AccountDetails'

interface UnknownAccountProps {
  pubkey: PublicKey
}

// To test this component use:
// NativeLoader1111111111111111111111111111111 (no account, just pubkey)
export const UnknownAccountOverview = ({ pubkey }: UnknownAccountProps) => {
  const account = useAccountInfo(pubkey)
  const tokenRegistry = useTokenRegistry()
  const cluster = useSolanaCluster()

  // Even if there is no matching account, we still display the pubkey

  const details = account || {
    executable: false,
    owner: undefined,
    lamports: undefined,
    data: undefined,
  }

  const label = addressLabel(pubkey.toBase58(), cluster.network, tokenRegistry)

  const assignedProgramId = (() => {
    if (!details.owner) {
      return null
    }

    try {
      const owner = details.owner.toBase58()

      const addressToDisplay = displayAddress(
        owner,
        cluster.network,
        tokenRegistry
      )
      return <AccountLink to={owner} label={addressToDisplay} />
    } catch (err) {
      return JSON.stringify(details.owner)
    }
  })()

  const space = getSpace(account)

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    label && ['Address Label', label],
    ['Balance (SOL)', <SolBalance lamports={details?.lamports || 0} />],
    space !== undefined && ['Allocated Data Size', `${space} byte(s)`],
    assignedProgramId && ['Assigned Program Id', assignedProgramId],
    details && ['Executable', details.executable ? 'Yes' : 'No'],
  ])

  return <ExplorerGrid rows={rows} />
}

export const UnknownAccount = (props: UnknownAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Overview">
        <UnknownAccountOverview {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
