import bs58 from 'bs58'

function isAccount(str: string) {
  try {
    const decoded = bs58.decode(str)
    return decoded.length === 32
  } catch {
    return false
  }
}

export default isAccount
