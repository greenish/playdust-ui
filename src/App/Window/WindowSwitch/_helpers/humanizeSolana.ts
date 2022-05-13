const humanizeSolana = (input?: number): string => {
  if (input === undefined) {
    return '◎ N/A';
  }

  const rounded = Math.round((input + Number.EPSILON) * 100) / 100;

  return `◎ ${rounded.toLocaleString()}`;
};

export default humanizeSolana;
