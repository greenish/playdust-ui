import BN from 'bn.js';
import React from 'react';
import lamportsToSolString from '../_helpers/lamportsToSolString';

interface SolBalanceProps {
  lamports?: number | BN;
  maximumFractionDigits?: number;
}

function SolBalance({
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
  );
}

export default SolBalance;
