import bs58 from 'bs58'

export type SearchType = 'account' | 'block' | 'epoch' | 'tx' | undefined

export function getSearchType(str: string): SearchType {
  const num = Number(str)

  if (!isNaN(num)) {
    // This is a temporary hack that will be resolved in a follow-up task
    if (num < 1000) {
      return 'epoch'
    }

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
