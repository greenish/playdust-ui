function round(value = 0, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(
    value
  );
}

export default round;
