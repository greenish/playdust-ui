import BN from 'bn.js'
import { lamportsToSolString } from '../../helpers/utils'

export function SolBalance({
  lamports,
  maximumFractionDigits = 9,
}: {
  lamports: number | BN
  maximumFractionDigits?: number
}) {
  return (
    <span>
      ◎
      <span className="font-monospace">
        {lamportsToSolString(lamports, maximumFractionDigits)}
      </span>
    </span>
  )
}
