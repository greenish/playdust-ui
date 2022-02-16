import { PublicKey } from '@solana/web3.js'

export const shortenPublicKey = (pk: PublicKey | string) => {
  const pkString = pk.toString()
  const { length } = pkString

  return `${pkString.slice(0, 4)}...${pkString.slice(length - 4)}`
}
