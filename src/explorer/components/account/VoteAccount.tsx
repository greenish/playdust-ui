import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import toLocaleString from '../../helpers/toLocaleString'
import { useAccountInfo } from '../../store'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  SlotLink,
  SolBalance,
} from '../common'
import { AccountDetails } from './AccountDetails'

interface VoteAccountProps {
  pubkey: PublicKey
}

export const VoteAccountContent = ({ pubkey }: VoteAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const voteAccount = (account.data as ParsedAccountData).parsed

  const lastTimestamp = toLocaleString(voteAccount.info.lastTimestamp.timestamp)

  const rows = [
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
    [
      <>
        Authorized Voter
        {voteAccount.info.authorizedVoters.length > 1 ? 's' : ''}
      </>,
      voteAccount.info.authorizedVoters.map((voter: any) => {
        return (
          <AccountLink
            key={voter.authorizedVoter.toString()}
            to={voter.authorizedVoter}
            allowCopy
          />
        )
      }),
    ],
    [
      'Authorized Withdrawer',
      <AccountLink to={voteAccount.info.authorizedWithdrawer} allowCopy />,
    ],
    ['Last Timestamp', lastTimestamp],
    ['Commission', voteAccount.info.commission + '%'],
    [
      'Root Slot',
      voteAccount.info.rootSlot !== null ? (
        <SlotLink to={voteAccount.info.rootSlot} allowCopy />
      ) : (
        'N/A'
      ),
    ],
  ]

  return <ExplorerGrid rows={rows} />
}

// Fx9gdBmp4Rer7rxu139ofGKcx3iffKS91gg2kFUeBvjD
export const VoteAccount = (props: VoteAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Vote Overview">
        <VoteAccountContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
