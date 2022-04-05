import bs58 from 'bs58'
import WindowUnion from '../types/WindowUnion'

const getWindowType = (state: string): WindowUnion => {
  if (state === '') {
    return 'home'
  }

  const num = Number(state)

  if (!isNaN(num)) {
    // This is a temporary hack that will be resolved in a follow-up task
    if (num < 1000) {
      return 'epoch'
    }

    return 'block'
  }

  try {
    const decoded = bs58.decode(state)

    if (decoded.length === 32) {
      return 'account'
    }

    if (decoded.length === 64) {
      return 'tx'
    }
  } catch (err) {}

  return 'search'
}

export default getWindowType
