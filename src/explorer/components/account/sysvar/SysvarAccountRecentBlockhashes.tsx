import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  SolBalance,
} from '../../common'
import { SysvarAccountRecentBlockhashesDetails } from '../AccountDetails'

interface SysvarAccountProps {
  pubkey: PublicKey
}

export const SysvarAccountRecentBlockhashesContent = ({
  pubkey,
}: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
  ]

  return <ExplorerGrid rows={rows} />
}

// SysvarRecentB1ockHashes11111111111111111111
export const SysvarAccountRecentBlockhashes = (props: SysvarAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Sysvar: Recent Blockhashes">
        <SysvarAccountRecentBlockhashesContent {...props} />
      </ExplorerCard>
      <SysvarAccountRecentBlockhashesDetails pubkey={props.pubkey} />
    </>
  )
}
