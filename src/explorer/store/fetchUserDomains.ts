import {
  getFilteredProgramAccounts,
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
  NAME_PROGRAM_ID,
} from '@bonfida/spl-name-service'
import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import { solanaCluster } from '../../app/store'

// Name auctionning Program ID
export const PROGRAM_ID = new PublicKey(
  'jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR'
)

export interface DomainInfo {
  name: string
  address: PublicKey
  class: PublicKey
}

async function getDomainKey(
  name: string,
  nameClass?: PublicKey,
  nameParent?: PublicKey
) {
  const hashedDomainName = await getHashedName(name)
  const nameKey = await getNameAccountKey(
    hashedDomainName,
    nameClass,
    nameParent
  )
  return nameKey
}

export async function findOwnedNameAccountsForUser(
  connection: Connection,
  userAccount: PublicKey
): Promise<PublicKey[]> {
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: userAccount.toBase58(),
      },
    },
  ]
  const accounts = await getFilteredProgramAccounts(
    connection,
    NAME_PROGRAM_ID,
    filters
  )
  return accounts.map((a) => a.publicKey)
}

export async function performReverseLookup(
  connection: Connection,
  nameAccounts: PublicKey[]
): Promise<DomainInfo[]> {
  let [centralState] = await PublicKey.findProgramAddress(
    [PROGRAM_ID.toBuffer()],
    PROGRAM_ID
  )

  const reverseLookupAccounts = await Promise.all(
    nameAccounts.map((name) => getDomainKey(name.toBase58(), centralState))
  )

  let names = await NameRegistryState.retrieveBatch(
    connection,
    reverseLookupAccounts
  )

  return names
    .map((name) => {
      if (!name?.data) {
        return undefined
      }
      const nameLength = new BN(name!.data.slice(0, 4), 'le').toNumber()
      return {
        name: name.data.slice(4, 4 + nameLength).toString() + '.sol',
        address: name.address,
        class: name.class,
      }
    })
    .filter((e) => !!e) as DomainInfo[]
}

export const fetchUserDomains = selectorFamily<DomainInfo[] | null, any>({
  key: 'userDomains',
  get:
    (pubkey) =>
    async ({ get }) => {
      // TODO: Allow only mainnet and custom
      // if (![Cluster.MainnetBeta, Cluster.Custom].includes(cluster)) return;

      const { endpoint } = get(solanaCluster)

      const connection = new Connection(endpoint, 'confirmed')

      const domains = await findOwnedNameAccountsForUser(connection, pubkey)
      let names = await performReverseLookup(connection, domains)
      names.sort((a, b) => {
        return a.name.localeCompare(b.name)
      })

      return names
    },
})

export const useUserDomains = (pubkey: PublicKey) =>
  useRecoilValue(fetchUserDomains(pubkey))
