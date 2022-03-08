import { MetadataJson, programs } from '@metaplex/js'
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js'
import { selectorFamily, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { getEditionInfo } from '../helpers/getEditionInfo'
import { pubkeyToString } from '../helpers/utils'
import { fetchTokenRegistry } from './fetchTokenRegistry'
import solanaCluster from './solanaCluster'

const Metadata = programs.metadata.Metadata

const processJson = (extended: any) => {
  if (!extended || extended?.properties?.files?.length === 0) {
    return
  }

  if (extended?.image) {
    extended.image = extended.image.startsWith('http')
      ? extended.image
      : `${extended.image}`
  }

  return extended
}

const _isMetaplexNFT = (data?: ParsedAccountData, nftData?: any): boolean => {
  const mintInfo = data?.parsed?.info

  return (
    data?.program === 'spl-token' &&
    data?.parsed?.type === 'mint' &&
    nftData &&
    mintInfo?.decimals === 0 &&
    parseInt(mintInfo.supply) === 1
  )
}

const getMetaDataJSON = async (
  id: string,
  metadata: programs.metadata.MetadataData
): Promise<MetadataJson | undefined> => {
  const uri = metadata.data.uri
  if (!uri) {
    return undefined
  }

  try {
    const res = await fetch(uri)
    const data = await res.json()
    try {
      localStorage.setItem(uri, JSON.stringify(data))
    } catch {
      // ignore
    }
    return processJson(data)
  } catch {
    return undefined
  }
}

type AccountDetails = {
  tokenDetails: any
  nftData: any
  isToken: boolean
  isMetaplexNFT: boolean
}

export const fetchAccountDetails = selectorFamily<AccountDetails, any>({
  key: 'accountDetails',
  get:
    (pubkey: PublicKey) =>
    async ({ get }) => {
      const tokenRegistry = get(fetchTokenRegistry)
      const { endpoint } = get(solanaCluster)

      const connection = new Connection(endpoint)

      let parsedAccount = await connection.getParsedAccountInfo(
        pubkey as PublicKey
      )

      const tokenDetails = tokenRegistry!.get(pubkey?.toBase58())

      const data = parsedAccount?.value?.data as ParsedAccountData
      const isToken =
        data?.program === 'spl-token' && data?.parsed?.type === 'mint'

      let nftData: any
      if (data?.parsed?.type === 'mint') {
        const metadata = await Metadata.load(
          connection,
          await Metadata.getPDA(pubkey as PublicKey)
        )
        if (metadata) {
          const editionInfo = await getEditionInfo(metadata, connection)
          const id = pubkeyToString(pubkey as PublicKey)
          const metadataJSON = await getMetaDataJSON(id, metadata.data)
          nftData = {
            metadata: metadata.data,
            json: metadataJSON,
            editionInfo,
          }
        }
      }

      const isMetaplexNFT = _isMetaplexNFT(data, nftData)

      return {
        tokenDetails,
        nftData,
        isToken,
        isMetaplexNFT,
      }
    },
})

export const useAccountDetails = (accountId: PublicKey) =>
  useRecoilValue(fetchAccountDetails(accountId))

export const useAccountDetailsLoadable = (accountId: PublicKey) =>
  useRecoilValueLoadable(fetchAccountDetails(accountId))