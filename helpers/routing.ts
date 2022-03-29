import bs58 from 'bs58'

export type SearchType = 'account' | 'block' | 'tx' | undefined

export function getSearchType(str: string): SearchType {
  if (!isNaN(Number(str))) {
    return 'block'
  }

  try {
    const decoded = bs58.decode(str)

    if (decoded.length === 32) {
      return 'account'
    }

    if (decoded.length === 64) {
      return 'tx'
    }
  } catch (err) {}

  return undefined
}
