function abbreviatedNumber(value: number, fixed = 1) {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: fixed,
  }).format(value);
}

const humanizeSolana = (input?: number): string =>
  `◎ ${abbreviatedNumber(input || 0)}`;

export default humanizeSolana;
