import { PublicKey } from '@solana/web3.js'
import {
  AccountDetails,
  AccountOverview,
  ExplorerContainer,
  ExplorerHeader,
} from '../components'

interface AccountPageProps {
  address: string
}

export const AccountPage = ({ address }: AccountPageProps) => {
  let pubkey: PublicKey | undefined

  try {
    pubkey = new PublicKey(address)
  } catch (err) {}

  return (
    <ExplorerContainer>
      <ExplorerHeader label="Account" filter="account" value={address} />
      {pubkey ? (
        <>
          <AccountOverview pubkey={pubkey} />
          <AccountDetails pubkey={pubkey} />
        </>
      ) : (
        <div>Invalid address</div>
      )}
    </ExplorerContainer>
  )
}
