import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import compact from '../../../helpers/compact'
import { useAccountInfo } from '../../../store'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  ExternalLink,
  SolBalance,
} from '../../common'
import { AccountDetails } from '../AccountDetails'

interface ConfigAccountProps {
  pubkey: PublicKey
}

const ValidatorInfoContent = ({ pubkey }: ConfigAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const { lamports } = account

  const configAccount = (account.data as ParsedAccountData).parsed

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={lamports} />],
    configAccount.info.configData.name && [
      'Name',
      configAccount.info.configData.name,
    ],
    configAccount.info.configData.keybaseUsername && [
      'Keybase Username',
      configAccount.info.configData.keybaseUsername,
    ],
    configAccount.info.configData.website && [
      'Website',
      <ExternalLink url={configAccount.info.configData.website} />,
    ],
    configAccount.info.configData.details && [
      'Details',
      configAccount.info.configData.details,
    ],
    configAccount.info.keys &&
      configAccount.info.keys.length > 1 && [
        'Signer',
        <AccountLink to={configAccount.info.keys[1].pubkey} allowCopy />,
      ],
  ])

  return <ExplorerGrid rows={rows} />
}

// 7qUt9itGTzT7QLNTbmoPwXCKR93pd4i8TqZp1BEj5ah8
export const ValidatorInfo = (props: ConfigAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Validator Info">
        <ValidatorInfoContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
