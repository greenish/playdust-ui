import { Chip, Tooltip } from '@mui/material'
import { PropsWithChildren } from 'react'
import { ProgramDataAccountInfo } from '../../../helpers/account'
import { fromProgramData } from '../../../helpers/securityTxt'
import { VerifiableBuild } from '../../../store'
import { ExternalLink } from '../../ExternalLinks'

export function SecurityLabel() {
  return (
    <>
      <Tooltip title="Security.txt helps security researchers to contact developers if they find security bugs.">
        <span>Security.txt</span>
      </Tooltip>{' '}
      <ExternalLink
        url="https://github.com/neodyme-labs/solana-security-txt"
        label="?"
      />
    </>
  )
}

export function SecurityTXTBadge({
  programData,
}: {
  programData: ProgramDataAccountInfo
}) {
  const { securityTXT, error } = fromProgramData(programData)

  if (securityTXT) {
    return <Chip color="success" label="Included" size="small" />
  }

  return <Chip color="error" label={error} size="small" />
}

export function LastVerifiedBuildLabel() {
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
      <>
        <Chip
          color="success"
          label={`${verifiableBuild.label}: Verified`}
          size="small"
        />
        <ExternalLink url={verifiableBuild.url} label="Info" />
      </>
    )
  }
  return (
    <Chip
      color="error"
      label={`${verifiableBuild.label}: Unverified`}
      size="small"
    />
  )
}

interface DownloadableProps {
  data: any
  filename: string
}

export const Downloadable = ({
  children,
}: PropsWithChildren<DownloadableProps>) => {
  return <>{children}</>
}
