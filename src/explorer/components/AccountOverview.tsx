import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent } from 'react'
import { useAccountInfo } from '../store'
import {
  ConfigAccount,
  NonceAccount,
  SPLTokenAccount,
  StakeAccount,
  SysvarAccount,
  UnknownAccount,
  UpgradeableLoaderAccount,
  VoteAccount,
} from './account'

interface AccountOverviewProps {
  pubkey: PublicKey
}
const map: Record<string, FunctionComponent<AccountOverviewProps>> = {
  'bpf-upgradeable-loader': UpgradeableLoaderAccount,
  stake: StakeAccount,
  'spl-token': SPLTokenAccount,
  nonce: NonceAccount,
  vote: VoteAccount,
  sysvar: SysvarAccount,
  config: ConfigAccount,
}

export const AccountOverview = (props: AccountOverviewProps) => {
  const account = useAccountInfo(props.pubkey)

  const accountData = account?.data as ParsedAccountData

  const AccountOverviewComponent = map[accountData?.program] || UnknownAccount

  return <AccountOverviewComponent {...props} />
}
