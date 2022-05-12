import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { BigNumber } from 'bignumber.js'
import { useRecoilValue } from 'recoil'
import solanaClusterAtom from '../../../../App/_atoms/solanaClusterAtom'
import compact from '../../../helpers/compact'
import { addressLabel } from '../../../helpers/tx'
import { useAccountInfo, useTokenRegistry } from '../../../store'
import { AccountLink, ExplorerCard, ExplorerGrid } from '../../common'

interface TokenAccountProps {
  pubkey: PublicKey
}

const TokenAccountContent = ({ pubkey }: TokenAccountProps) => {
  const account = useAccountInfo(pubkey)
  const cluster = useRecoilValue(solanaClusterAtom)
  const tokenRegistry = useTokenRegistry()
  const label = addressLabel(pubkey.toBase58(), cluster.network, tokenRegistry)

  const data = account?.data as ParsedAccountData

  const info = data?.parsed?.info

  let unit, balance
  if (info.isNative) {
    unit = 'SOL'
    balance = (
      <>
        ◎
        <span className="font-monospace">
          {new BigNumber(info.tokenAmount.uiAmountString).toFormat(9)}
        </span>
      </>
    )
  } else {
    balance = <>{info.tokenAmount.uiAmountString}</>
    unit = tokenRegistry.get(info.mint)?.symbol || 'tokens'
  }

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    label && ['Address Label', label],
    ['Mint', <AccountLink to={info.mint} allowCopy />],
    ['Owner', <AccountLink to={info.owner} allowCopy />],
    [`Token balance (${unit})`, balance],
    info.state === 'uninitialized' && ['Status', 'Uninitialized'],
    info.rentExemptReserve && [
      'Rent-exempt reserve (SOL)',
      new BigNumber(info.rentExemptReserve.uiAmountString).toFormat(9),
    ],
  ])

  return <ExplorerGrid rows={rows} />
}

// DNiJ7fmPKDNNMXTAmiWKDTwgHdWW6KUuTZcEyP1Pmh4j
export const TokenAccount = (props: TokenAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Token Account">
      <TokenAccountContent {...props} />
    </ExplorerCard>
  )
}
