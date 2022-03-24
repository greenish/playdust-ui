import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { useAccountDetails, useAccountInfo } from '../../store'
import { ErrorCard } from '../ErrorCard'
import { ExplorerCard } from '../ExplorerCard'
import {
  FungibleTokenMintAccount,
  MultisigAccount,
  TokenAccount,
} from './spltoken'

interface SPLTokenAccountProps {
  pubkey: PublicKey
}

const TokenMintAccountContent = (props: SPLTokenAccountProps) => {
  const { pubkey } = props
  const router = useRouter()
  const details = useAccountDetails(pubkey)

  const { nftData, isMetaplexNFT } = details

  if (isMetaplexNFT && nftData) {
    router.push(`/nfts/${pubkey.toBase58()}`)
    return null
  }

  return <FungibleTokenMintAccount {...props} />
}

export const TokenMintAccount = (props: SPLTokenAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Token Mint Account">
      <TokenMintAccountContent {...props} />
    </ExplorerCard>
  )
}

const map: Record<string, FunctionComponent<SPLTokenAccountProps>> = {
  mint: TokenMintAccount,
  account: TokenAccount,
  multisig: MultisigAccount,
}

export const SPLTokenAccount = (props: SPLTokenAccountProps) => {
  const account = useAccountInfo(props.pubkey)

  console.log('account', account)

  const accountData = account?.data as ParsedAccountData

  if (accountData?.program !== 'spl-token') {
    return <ErrorCard message="Invalid account program" />
  }

  const TokenAccountOverviewComponent = map[accountData?.parsed?.type]

  if (!TokenAccountOverviewComponent) {
    return <ErrorCard message="Invalid account type" />
  }

  return <TokenAccountOverviewComponent {...props} />
}
