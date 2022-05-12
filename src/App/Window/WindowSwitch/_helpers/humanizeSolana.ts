const humanizeSolana = (input?: number) => {
  if (!input) {
    return '0';
  }

  const rounded = Math.round((input + Number.EPSILON) * 100) / 100;

  return `${rounded.toLocaleString()} SOL`;
};

export default humanizeSolana;
