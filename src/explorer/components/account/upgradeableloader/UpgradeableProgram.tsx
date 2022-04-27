import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { compact } from '../../../../common/helpers/utils'
import { addressLabel } from '../../../helpers/tx'
import {
  useAccountInfo,
  useSolanaCluster,
  useVerifiableBuilds,
  VerifiableBuild,
} from '../../../store'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  SlotLink,
  SolBalance,
} from '../../common'
import { AccountDetails } from '../AccountDetails'
import {
  LastVerifiedBuildLabel,
  SecurityLabel,
  SecurityTXTBadge,
  VerifiedBadge,
} from './Helpers'

interface UpgradeableLoaderAccountProps {
  pubkey: PublicKey
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

  const cluster = useSolanaCluster()
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

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['Address Label', label],
    ['SOL Balance', <SolBalance lamports={lamports} />],
    ['Executable', executable ? 'Yes' : 'No'],
    [
      'Executable Data',
      <AccountLink to={accountData.parsed.info.programData} allowCopy />,
    ],
    [
      'Upgradeable',
      programAccountData.parsed.info.authority !== null ? 'Yes' : 'No',
    ],
    [
      <LastVerifiedBuildLabel />,
      verifiableBuilds.map((build: VerifiableBuild, idx: number) => (
        <VerifiedBadge
          key={idx}
          verifiableBuild={build}
          deploySlot={programData.slot}
        />
      )),
    ],
    [
      <SecurityLabel />,
      <SecurityTXTBadge
        programData={(programAccount.data as ParsedAccountData).parsed.info}
      />,
    ],
    [
      'Last Deployed Slot',
      <SlotLink to={programAccountData.parsed.info.slot} allowCopy />,
    ],
    programAccountData.parsed.info.authority !== null && [
      'Upgrade Authority',
      <AccountLink to={programAccountData.parsed.info.authority} allowCopy />,
    ],
  ])

  return <ExplorerGrid rows={rows} />
}

// FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH
// Security.txt: HPxKXnBN4vJ8RjpdqDCU7gvNQHeeyGnSviYTJ4fBrDt4 cluster=devnet
export const UpgradeableProgram = (props: UpgradeableLoaderAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Upgradeable Program">
        <UpgradeableProgramContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
