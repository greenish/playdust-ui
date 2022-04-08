import { PublicKey } from '@solana/web3.js'
import { Instructions, Transfers } from '..'
import { ExplorerTab, ExplorerTabs } from '../../../ExplorerTabs'
import { Transactions } from '../../../Transactions'
import { Distribution } from '../Distribution'
import { Metadata } from '../Metadata'

type TokenOverviewProps = {
  pubkey: PublicKey
}

export const Details = ({ pubkey }: TokenOverviewProps) => {
  const tabs: ExplorerTab[] = [
    ['History', Transactions],
    ['Transfers', Transfers],
    ['Instructions', Instructions],
    ['Distribution', Distribution],
    ['Metadata', Metadata],
  ]

  return <ExplorerTabs tabs={tabs} pubkey={pubkey} />
}
