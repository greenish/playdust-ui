import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

/*
 * ellipsisify
 * @param {string} str The string you need to cut off
 * @param {number} cutoff The position on which you want to cut off
 * @param {number} remain The amount of characters that should remain after the ellipsis
 * @param {string} [ellipsis='...'] The string to add to the end
 * @returns {string} ellipsisified string
 */
export function ellipsisify(
  str: string,
  cutoff: number,
  remain: number,
  ellipsis = '...'
) {
  const inputType = typeof str
  if (inputType !== 'string') {
    return ''
  }

  if (str.length <= cutoff) return str
  if (!cutoff || cutoff + remain >= str.length) return str
  if (!remain) return `${str.substr(0, cutoff)}${ellipsis}`

  return `${str.substr(0, cutoff)}${ellipsis}${str.substr(str.length - remain)}`
}

export function lamportsToSol(lamports: number | BN): number {
  if (typeof lamports === 'number') {
    return Math.abs(lamports) / LAMPORTS_PER_SOL
  }

  let signMultiplier = 1
  if (lamports.isNeg()) {
    signMultiplier = -1
  }

  const absLamports = lamports.abs()
  const lamportsString = absLamports.toString(10).padStart(10, '0')
  const splitIndex = lamportsString.length - 9
  const solString =
    lamportsString.slice(0, splitIndex) + '.' + lamportsString.slice(splitIndex)
  return signMultiplier * parseFloat(solString)
}

export function lamportsToSolString(
  lamports: number | BN,
  maximumFractionDigits: number = 9
): string {
  const sol = lamportsToSol(lamports)
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(sol)
}

export function pubkeyToString(key: PublicKey | string = '') {
  return typeof key === 'string' ? key : key?.toBase58() || ''
}

export function range(from: number, to: number, step: number) {
  return [...Array(Math.floor((to - from) / step) + 1)].map(
    (_, i) => from + i * step
  )
}

export const shortenPublicKey = (pk: PublicKey | string) =>
  ellipsisify(pk.toString(), 4, 4)
