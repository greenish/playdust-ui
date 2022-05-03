function normalizeTokenAmount(raw: string | number, decimals: number): number {
  let rawTokens: number
  if (typeof raw === 'string') rawTokens = parseInt(raw)
  else rawTokens = raw
  return rawTokens / Math.pow(10, decimals)
}

export default normalizeTokenAmount
