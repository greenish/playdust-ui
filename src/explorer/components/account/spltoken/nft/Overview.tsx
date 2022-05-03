import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import compact from '../../../../helpers/compact'
import {
  useAccountInfo,
  useEditionInfo,
  useNFTDetails,
} from '../../../../store'
import { AccountLink, ExplorerGrid } from '../../../common'

type TokenOverviewProps = {
  pubkey: PublicKey
}

export const Overview = ({ pubkey }: TokenOverviewProps) => {
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
