import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent } from 'react'
import WindowProps from '../../App/Window/_types/WindowPropsType'
import {
  ConfigAccount,
  NonceAccount,
  SPLTokenAccount,
  StakeAccount,
  SysvarAccount,
  UnknownAccount,
  UpgradeableLoaderAccount,
  VoteAccount,
} from '../components/account'
import { ExplorerContainer } from '../components/common'
import { useAccountInfo } from '../store'

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

export const Account = (props: AccountOverviewProps) => {
  const account = useAccountInfo(props.pubkey)

  const accountData = account?.data as ParsedAccountData

  const AccountComponent = map[accountData?.program] || UnknownAccount

  return <AccountComponent {...props} />
}

export const AccountPage = ({ state }: WindowProps) => {
  const address = state
  let pubkey: PublicKey | undefined

  try {
    pubkey = new PublicKey(address)
  } catch (err) {}

  return (
    <ExplorerContainer filter="account" value={address}>
      {pubkey ? <Account pubkey={pubkey} /> : <div>Invalid address</div>}
    </ExplorerContainer>
  )
}
