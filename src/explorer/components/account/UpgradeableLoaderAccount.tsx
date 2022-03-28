import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent } from 'react'
import { useAccountInfo } from '../../store'
import { UnknownAccount } from './'
import {
  UpgradeableProgram,
  UpgradeableProgramBuffer,
  UpgradeableProgramData,
} from './upgradeableloader'

interface UpgradeableLoaderAccountProps {
  pubkey: PublicKey
}

const map: Record<string, FunctionComponent<UpgradeableLoaderAccountProps>> = {
  program: UpgradeableProgram,
  programData: UpgradeableProgramData,
  buffer: UpgradeableProgramBuffer,
  uninitialized: UnknownAccount,
}

export const UpgradeableLoaderAccount = ({
  pubkey,
}: UpgradeableLoaderAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const accountType = (account?.data as ParsedAccountData)?.parsed?.type

  const Section = map[accountType]

  return <Section pubkey={pubkey} />
}
