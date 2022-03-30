import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { compact } from '../../../../helpers/utils'
import { useAccountInfo } from '../../store'
import { AccountDetails } from '../AccountDetails'
import { ExplorerCard } from '../ExplorerCard'
import { ExplorerGrid } from '../ExplorerGrid'
import { AccountLink } from '../Links'
import { SolBalance } from '../SolBalance'

interface NonceAccountProps {
  pubkey: PublicKey
}

export const NonceAccountContent = ({ pubkey }: NonceAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const { lamports } = account

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={lamports} />],
    ['Authority', <AccountLink to={parsed.info.authority} allowCopy />],
    ['Blockhash', <code>{parsed.info.blockhash}</code>],
    [
      'Fee',
      <>
        {parsed.info.feeCalculator.lamportsPerSignature} lamports per signature
      </>,
    ],
  ])

  return <ExplorerGrid rows={rows} />
}

export const NonceAccount = (props: NonceAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Nonce Overview">
      <NonceAccountContent {...props} />
      <AccountDetails pubkey={props.pubkey} />
    </ExplorerCard>
  )
}
