import { Stack } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { Instructions, Transfers } from '.'
import { compact } from '../../../../common/helpers/utils'
import { useAccountInfo, useEditionInfo, useNFTDetails } from '../../../store'
import { ExplorerGrid } from '../../ExplorerGrid'
import { ExplorerTab, ExplorerTabs } from '../../ExplorerTabs'
import { AccountLink } from '../../Links'
import { Transactions } from '../../Transactions'
import { Distribution } from './Distribution'
import { Metadata } from './Metadata'
import { NonFungibleTokenMintAccountHeader } from './NonFungibleTokenMintAccountHeader'

type TokenOverviewProps = {
  pubkey: PublicKey
}

export const NonFungibleTokenMintAccountOverview = ({
  pubkey,
}: TokenOverviewProps) => {
  const account = useAccountInfo(pubkey)
  const nftDetails = useNFTDetails(pubkey)
  const editionInfo = useEditionInfo(pubkey)

  const data = account?.data as ParsedAccountData

  const {
    parsed: {
      info: { mintAuthority },
    },
  } = data

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    editionInfo.masterEdition?.maxSupply && [
      'Max Total Supply',
      editionInfo.masterEdition.maxSupply.toNumber() === 0
        ? 1
        : editionInfo.masterEdition.maxSupply.toNumber(),
    ],
    editionInfo.masterEdition?.supply && [
      'Current Supply',
      editionInfo.masterEdition.supply.toNumber() === 0
        ? 1
        : editionInfo.masterEdition.supply.toNumber(),
    ],
    /*
    nftDetails?.collection?.verified && [
      'Verified Collection Address'
      <AccountLink
        to={nftDetails.collection.key}
        allowCopy
      />
    ],
    */
    mintAuthority && [
      'Mint Authority',
      <AccountLink to={mintAuthority} allowCopy />,
    ],
    nftDetails?.updateAuthority && [
      'Update Authority',
      <AccountLink to={nftDetails.updateAuthority} allowCopy />,
    ],
    nftDetails?.data && [
      'Seller Fee',
      `${nftDetails?.data.sellerFeeBasisPoints / 100}%`,
    ],
  ])

  return <ExplorerGrid rows={rows} />
}

export const NonFungibleTokenMintAccountDetails = ({
  pubkey,
}: TokenOverviewProps) => {
  const tabs: ExplorerTab[] = [
    ['History', Transactions],
    ['Transfers', Transfers],
    ['Instructions', Instructions],
    ['Distribution', Distribution],
    ['Metadata', Metadata],
  ]

  return <ExplorerTabs tabs={tabs} pubkey={pubkey} />
}

export const NonFungibleTokenMintAccount = (props: TokenOverviewProps) => {
  return (
    <Stack spacing={2}>
      <NonFungibleTokenMintAccountHeader {...props} />
      <NonFungibleTokenMintAccountOverview {...props} />
      <NonFungibleTokenMintAccountDetails pubkey={props.pubkey} />
    </Stack>
  )
}
