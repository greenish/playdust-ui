import BN from 'bn.js'
import lamportsToSol from './lamportsToSol'

function lamportsToSolString(
  lamports: number | BN,
  maximumFractionDigits: number = 9
): string {
  const sol = lamportsToSol(lamports)
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(sol)
}

export default lamportsToSolString
