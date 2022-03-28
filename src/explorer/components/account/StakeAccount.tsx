import { PublicKey } from '@solana/web3.js'
import {
  AuthoritiesCard,
  DelegationCard,
  LockupCard,
  OverviewCard,
} from './stake'

interface StakeAccountProps {
  pubkey: PublicKey
}

// Stake11111111111111111111111111111111111111
// AD8QGGAk1fJUYsyGPidF1Xu4TS4koc4BLirc1YE8uMxQ
export const StakeAccount = ({ pubkey }: StakeAccountProps) => {
  return (
    <>
      <LockupCard pubkey={pubkey} />
      <OverviewCard pubkey={pubkey} />
      <DelegationCard pubkey={pubkey} />
      <AuthoritiesCard pubkey={pubkey} />
    </>
  )
}
