import { PublicKey } from '@solana/web3.js'
import { useAccountInfo, useEditionInfo, useNFTDetails } from '../../../store'
import { DynamicReactJson } from '../../DynamicReactJson'

interface MetadataProps {
  pubkey: PublicKey
}

export const Metadata = ({ pubkey }: MetadataProps) => {
  const account = useAccountInfo(pubkey)
  const nftDetails = useNFTDetails(pubkey)
  const editionInfo = useEditionInfo(pubkey)

  const src = {
    account,
    nftDetails,
    editionInfo,
  }

  return <DynamicReactJson src={src} />
}
