import { PublicKey } from '@solana/web3.js'
import { useRecoilValue } from 'recoil'
import { fetchNFTDetails, solanaCluster } from '../../../store'

export * from './coinPrice'
export * from './fetchAccountDetails'
export * from './fetchAccountHistory'
export * from './fetchAccountInfo'
export * from './fetchBlock'
export * from './fetchCoinGecko'
export * from './fetchEpoch'
export * from './fetchLargestAccounts'
export * from './fetchParsedTokenAccountsByOwner'
export * from './fetchSignaturesForAddress'
export * from './fetchSlot'
export * from './fetchStakeActivation'
export * from './fetchTokenRegistry'
export * from './fetchTransaction'
export * from './fetchUserDomains'
export * from './fetchVerifiableBuilds'
export * from './pageIdx'

export const useNFTDetails = (pubkey: PublicKey) =>
  useRecoilValue(fetchNFTDetails(pubkey.toBase58()))
export const useSolanaCluster = () => useRecoilValue(solanaCluster)
