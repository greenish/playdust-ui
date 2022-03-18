import { Grid, Tooltip } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent, PropsWithChildren } from 'react'
import { useRecoilValue } from 'recoil'
import { solanaCluster } from '../../../../store'
import { getSpace } from '../../helpers/account'
import { addressLabel } from '../../helpers/tx'
import {
  useAccountInfo,
  useVerifiableBuilds,
  VerifiableBuild,
} from '../../store'
import { ExplorerCard } from '../ExplorerCard'
import { Link } from '../Link'
import { AccountLink, SlotLink } from '../Links'
import { SolBalance } from '../SolBalance'
import { UnknownAccount } from './'

interface ProgramBufferAccountInfo {
  authority?: string
}

interface UpgradeableLoaderAccountProps {
  pubkey: PublicKey
}

const LastVerifiedBuildLabel = () => {
  return (
    <Tooltip title="Indicates whether the program currently deployed on-chain is verified to match the associated published source code, when it is available.">
      <span>Verifiable Build Status</span>
    </Tooltip>
  )
}

export function VerifiedBadge({
  verifiableBuild,
  deploySlot,
}: {
  verifiableBuild: VerifiableBuild
  deploySlot: number
}) {
  if (verifiableBuild && verifiableBuild.verified_slot === deploySlot) {
    return (
      <Link href={verifiableBuild.url} target="_blank" rel="noreferrer">
        {verifiableBuild.label}: Verified
      </Link>
    )
  }
  return <span>{verifiableBuild.label}: Unverified</span>
}

interface DownloadableProps {
  data: any
  filename: string
}

const Downloadable = ({ children }: PropsWithChildren<DownloadableProps>) => {
  return <>{children}</>
}

const UpgradeableProgramContent = ({
  pubkey,
}: UpgradeableLoaderAccountProps) => {
  const account = useAccountInfo(pubkey)

  const programData = (account?.data as ParsedAccountData)?.parsed?.info
    ?.programData

  const programAccount = useAccountInfo(
    programData ? new PublicKey(programData) : undefined
  )

  const cluster = useRecoilValue(solanaCluster)
  const verifiableBuilds = useVerifiableBuilds(pubkey)

  if (!account || !programAccount) {
    return <div>No data available</div>
  }

  const { executable, lamports } = account

  const accountData = account.data as ParsedAccountData
  const programAccountData = programAccount.data as ParsedAccountData

  // if (programData === undefined) {
  // return <ErrorCard text="Invalid Upgradeable Program account" />;
  // }

  const label = addressLabel(pubkey.toBase58(), cluster.network)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Address Label
      </Grid>
      <Grid item xs={12} md={10}>
        {label}
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Executable
      </Grid>
      <Grid item xs={12} md={10}>
        {executable ? 'Yes' : 'No'}
      </Grid>
      <Grid item xs={12} md={2}>
        Executable Data
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={accountData.parsed.info.programData} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Upgradeable
      </Grid>
      <Grid item xs={12} md={10}>
        {programAccountData.parsed.info.authority !== null ? 'Yes' : 'No'}
      </Grid>
      <Grid item xs={12} md={2}>
        <LastVerifiedBuildLabel />
      </Grid>
      <Grid item xs={12} md={10}>
        {verifiableBuilds.map((build: VerifiableBuild, idx: number) => (
          <VerifiedBadge
            key={idx}
            verifiableBuild={build}
            deploySlot={programData.slot}
          />
        ))}
      </Grid>
      <Grid item xs={12} md={2}>
        Last Deployed Slot
      </Grid>
      <Grid item xs={12} md={10}>
        <SlotLink to={programAccountData.parsed.info.slot} allowCopy />
      </Grid>
      {programAccountData.parsed.info.authority !== null && (
        <>
          <Grid item xs={12} md={2}>
            Upgrade Authority
          </Grid>
          <Grid item xs={12} md={10}>
            <AccountLink
              to={programAccountData.parsed.info.authority}
              allowCopy
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

// FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH
export const UpgradeableProgram = (props: UpgradeableLoaderAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Upgradeable Program">
      <UpgradeableProgramContent {...props} />
    </ExplorerCard>
  )
}

const UpgradeableProgramDataContent = ({
  pubkey,
}: UpgradeableLoaderAccountProps) => {
  const account = useAccountInfo(pubkey)

  const programData = (account?.data as ParsedAccountData)?.parsed?.info

  if (!account) {
    return <div>No data available</div>
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Data (Bytes)
      </Grid>
      <Grid item xs={12} md={10}>
        <Downloadable
          data={programData.data[0]}
          filename={`${pubkey.toString()}.bin`}
        >
          <span className="me-2">{getSpace(account)}</span>
        </Downloadable>
      </Grid>
      <Grid item xs={12} md={2}>
        Upgradeable
      </Grid>
      <Grid item xs={12} md={10}>
        {programData.authority !== null ? 'Yes' : 'No'}
      </Grid>
      <Grid item xs={12} md={2}>
        Last Deployed Slot
      </Grid>
      <Grid item xs={12} md={10}>
        <SlotLink to={programData.slot} allowCopy />
      </Grid>
      {programData.authority !== null && (
        <>
          <Grid item xs={12} md={2}>
            Upgrade Authority
          </Grid>
          <Grid item xs={12} md={10}>
            <AccountLink to={programData.authority} allowCopy />
          </Grid>
        </>
      )}
    </Grid>
  )
}

// 72xbspJP8vtJ91Lp7k6mqJXFiPSvpad5BBRrixfAWh8m
export const UpgradeableProgramData = (
  props: UpgradeableLoaderAccountProps
) => {
  return (
    <ExplorerCard skeleton="table" title="Program Executable Data Account">
      <UpgradeableProgramDataContent {...props} />
    </ExplorerCard>
  )
}

const UpgradeableProgramBufferContent = ({
  pubkey,
}: UpgradeableLoaderAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const accountData = account?.data as ParsedAccountData
  const programBuffer =
    (accountData.parsed?.info as ProgramBufferAccountInfo) || {}
  const details = account || {}

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account?.lamports || 0} />
      </Grid>
      <Grid item xs={12} md={2}>
        Data (Bytes)
      </Grid>
      <Grid item xs={12} md={10}>
        {getSpace(account)}
      </Grid>
      {programBuffer.authority && (
        <>
          <Grid item xs={12} md={2}>
            Deploy Authority
          </Grid>
          <Grid item xs={12} md={10}>
            <AccountLink to={programBuffer.authority} />
          </Grid>
        </>
      )}
      {details && (
        <>
          <Grid item xs={12} md={2}>
            Owner
          </Grid>
          <Grid item xs={12} md={10}>
            <AccountLink to={details.owner.toBase58()} />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export const UpgradeableProgramBuffer = (
  props: UpgradeableLoaderAccountProps
) => {
  return (
    <ExplorerCard skeleton="table" title="Program Deploy Buffer Account">
      <UpgradeableProgramBufferContent {...props} />
    </ExplorerCard>
  )
}

const map: Record<string, FunctionComponent<UpgradeableLoaderAccountProps>> = {
  program: UpgradeableProgram,
  programData: UpgradeableProgramData,
  buffer: UpgradeableProgramBuffer,
  uninitialized: UnknownAccount,
}

export const UpgradeableLoaderAccount = ({
  pubkey,
}: UpgradeableLoaderAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const accountType = (account?.data as ParsedAccountData)?.parsed?.type

  const Section = map[accountType]

  return <Section pubkey={pubkey} />
}
