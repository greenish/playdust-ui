import BN from 'bn.js';
import React from 'react';
import lamportsToSolString from './_helpers/lamportsToSolString';

interface SolBalanceProps {
  lamports?: number | BN | null;
  maximumFractionDigits?: number;
}

function SolBalance({ lamports, maximumFractionDigits = 9 }: SolBalanceProps) {
  return (
    <span>
      <pre>◎ {lamportsToSolString(lamports ?? 0, maximumFractionDigits)}</pre>
    </span>
  );
}

export default SolBalance;
