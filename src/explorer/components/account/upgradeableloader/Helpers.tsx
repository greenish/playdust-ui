import { Tooltip } from '@mui/material'
import { PropsWithChildren } from 'react'
import { VerifiableBuild } from '../../../store'
import { ExternalLink } from '../../ExternalLinks'

export const LastVerifiedBuildLabel = () => {
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
      <ExternalLink
        url={verifiableBuild.url}
        label={`${verifiableBuild.label}: Verified`}
      />
    )
  }
  return <span>{verifiableBuild.label}: Unverified</span>
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
