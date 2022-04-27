import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  SolBalance,
} from '../../common'
import { AccountDetails } from '../AccountDetails'

interface SysvarAccountProps {
  pubkey: PublicKey
}

const SysvarAccountFeesContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
    ['Lamports Per Signature', parsed.info.feeCalculator.lamportsPerSignature],
  ]

  return <ExplorerGrid rows={rows} />
}

// SysvarFees111111111111111111111111111111111
// History
export const SysvarAccountFees = (props: SysvarAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Sysvar: Fees">
        <SysvarAccountFeesContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
