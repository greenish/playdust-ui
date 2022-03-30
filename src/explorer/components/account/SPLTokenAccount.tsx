import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent } from 'react'
import { useAccountDetails, useAccountInfo } from '../../store'
import { ErrorCard } from '../ErrorCard'
import { ExplorerCard } from '../ExplorerCard'
import {
  FungibleTokenMintAccount,
  MultisigAccount,
  NonFungibleTokenMintAccount,
  TokenAccount,
} from './spltoken'

interface SPLTokenAccountProps {
  pubkey: PublicKey
}

const TokenMintAccountContent = (props: SPLTokenAccountProps) => {
  const { pubkey } = props
  const details = useAccountDetails(pubkey)

  const { nftData, isMetaplexNFT } = details

  if (isMetaplexNFT && nftData) {
    return <NonFungibleTokenMintAccount {...props} />
  }

  return <FungibleTokenMintAccount {...props} />
}

export const TokenMintAccount = (props: SPLTokenAccountProps) => {
  return (
    <ExplorerCard skeleton="table">
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

  const accountData = account?.data as ParsedAccountData

  if (accountData?.program !== 'spl-token') {
    return <ErrorCard message="Invalid account program" />
  }

  const TokenAccountComponent = map[accountData?.parsed?.type]

  if (!TokenAccountComponent) {
    return <ErrorCard message="Invalid account type" />
  }

  return <TokenAccountComponent {...props} />
}
