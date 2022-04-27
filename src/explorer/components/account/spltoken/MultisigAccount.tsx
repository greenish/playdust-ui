import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { AccountLink, ExplorerCard, ExplorerGrid } from '../../common'

interface TokenAccountProps {
  pubkey: PublicKey
}

const MultisigAccountContent = ({ pubkey }: TokenAccountProps) => {
  const account = useAccountInfo(pubkey)
  const data = account?.data as ParsedAccountData

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['Required Signers', data?.parsed?.info?.numRequiredSigners],
    ['Valid Signers', data?.parsed?.info?.numValidSigners],
    ...(data?.parsed?.info?.signers || []).map((signer: string) => [
      'Signer',
      <AccountLink to={signer} allowCopy />,
    ]),
  ]

  return <ExplorerGrid rows={rows} />
}

// Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi
export const MultisigAccount = (props: TokenAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Multisig Account">
      <MultisigAccountContent {...props} />
    </ExplorerCard>
  )
}
