import BN from 'bn.js';
import lamportsToSol from '../../../_helpers/lamportsToSol';

function lamportsToSolString(
  lamports: number | BN,
  maximumFractionDigits = 9
): string {
  const sol = lamportsToSol(lamports);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(sol);
}

export default lamportsToSolString;
