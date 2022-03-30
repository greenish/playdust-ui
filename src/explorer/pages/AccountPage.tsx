import { PublicKey } from '@solana/web3.js'
import WindowProps from '../../app/types/WindowProps'
import {
  AccountDetails,
  AccountOverview,
  ExplorerContainer,
  ExplorerHeader,
} from '../components'

export const AccountPage = ({ state }: WindowProps) => {
  const address = state
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
