import { PublicKey } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import { pageIdx } from './pageIdx'

export interface AnchorBuild {
  aborted: boolean
  address: string
  created_at: string
  updated_at: string
  descriptor: string[]
  docker: string
  id: number
  name: string
  sha256: string
  upgrade_authority: string
  verified: string
  verified_slot: number
  state: string
}

export type VerifiableBuild =
  | {
      label: string
      id: number
      verified_slot: number
      url: string
    }
  | {
      label: string
      verified_slot: null
    }

const defaultAnchorBuild = {
  label: 'Anchor',
  verified_slot: null,
}

/**
 * Returns a verified build from the anchor registry. null if no such
 * verified build exists, e.g., if the program has been upgraded since the
 * last verified build.
 */
export async function getAnchorVerifiableBuild(
  programId: PublicKey,
  limit: number = 5
): Promise<VerifiableBuild> {
  const url = `https://anchor.projectserum.com/api/v0/program/${programId.toString()}/latest?limit=${limit}`
  const latestBuildsResp = await fetch(url)

  // Filter out all non successful builds.
  const latestBuilds = (await latestBuildsResp.json()).filter(
    (b: AnchorBuild) =>
      !b.aborted && b.state === 'Built' && b.verified === 'Verified'
  ) as AnchorBuild[]

  if (latestBuilds.length === 0) {
    return defaultAnchorBuild
  }

  // Get the latest build.
  const { verified_slot, id } = latestBuilds[0]
  return {
    ...defaultAnchorBuild,
    verified_slot,
    id,
    url: `https://anchor.projectserum.com/build/${id}`,
  }
}

export const fetchVerifiableBuilds = selectorFamily<VerifiableBuild[], any>({
  key: 'verifiableBuild',
  get:
    (programAddress) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      try {
        const resp = await getAnchorVerifiableBuild(programAddress)
        return [resp]
      } catch (error) {
        return [defaultAnchorBuild]
      }
    },
})

export const useVerifiableBuilds = (programAddress: PublicKey | undefined) =>
  useRecoilValue(fetchVerifiableBuilds(programAddress))
