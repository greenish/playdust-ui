import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent } from 'react'
import { useAccountInfo } from '../../store'
import { ErrorCard } from '../common'
import { StakeConfig, ValidatorInfo } from './config'

interface ConfigAccountProps {
  pubkey: PublicKey
}

const map: Record<string, FunctionComponent<ConfigAccountProps>> = {
  stakeConfig: StakeConfig,
  validatorInfo: ValidatorInfo,
}

// Config1111111111111111111111111111111111111
export const ConfigAccount = ({ pubkey }: ConfigAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <ErrorCard />
  }

  const Account =
    map[(account.data as ParsedAccountData).parsed.type] || ErrorCard

  return <Account pubkey={pubkey} />
}
