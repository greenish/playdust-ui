import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: '/auction-house',
})

export const makeNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<Buffer> => {
  const { data } = await instance.post(`/bid`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const makeNFTListing = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<Buffer> => {
  const { data } = await instance.post(`/ask`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const executeNFTSale = async (
  wallet: string,
  mint: string,
  buyPrice: number,
  buyerWallet: string
): Promise<Buffer> => {
  const { data } = await instance.post(`/execute-sale`, {
    wallet,
    sellerWallet: wallet,
    buyerWallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export default instance
