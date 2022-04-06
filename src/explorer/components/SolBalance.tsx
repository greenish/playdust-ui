import BN from 'bn.js'
import { lamportsToSolString } from '../../common/helpers/utils'

interface SolBalanceProps {
  lamports?: number | BN
  maximumFractionDigits?: number
}

export function SolBalance({
  lamports = 0,
  maximumFractionDigits = 9,
}: SolBalanceProps) {
  return (
    <span>
      ◎
      <span className="font-monospace">
        {lamportsToSolString(lamports, maximumFractionDigits)}
      </span>
    </span>
  )
}
