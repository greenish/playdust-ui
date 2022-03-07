import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useRouter } from 'next/router'
import { useAccountDetails, useAccountInfo } from '../../store'
import {
  ConfigAccount,
  NonceAccount,
  StakeAccount,
  SysvarAccount,
  TokenAccount,
  UnknownAccount,
  UpgradeableLoaderAccount,
  VoteAccount,
} from './account'

interface AccountOverviewProps {
  pubkey: PublicKey
}
const map: Record<string, any> = {
  'bpf-upgradeable-loader': UpgradeableLoaderAccount,
  stake: StakeAccount,
  'spl-token': TokenAccount,
  nonce: NonceAccount,
  vote: VoteAccount,
  sysvar: SysvarAccount,
  config: ConfigAccount,
}

export const AccountOverview = (props: AccountOverviewProps) => {
  const router = useRouter()
  const account = useAccountInfo(props.pubkey)
  const details = useAccountDetails(props.pubkey)

  const accountData = account?.data as ParsedAccountData

  const { isToken } = details

  if (isToken) {
    router.push(`/token/${router.query.id}`)
  }

  const AccountOverviewComponent =
    ('parsed' in accountData ? map[accountData?.program] : undefined) ||
    UnknownAccount

  return <AccountOverviewComponent {...props} />
}
