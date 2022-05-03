import { PublicKey } from '@solana/web3.js'

function pubkeyToString(key: PublicKey | string = '') {
  return typeof key === 'string' ? key : key?.toBase58() || ''
}

export default pubkeyToString
