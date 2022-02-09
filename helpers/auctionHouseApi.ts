import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: `/playdust-api`,
})

export const makeNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number,
  auctionHouse: string
): Promise<Buffer> => {
  const prefix = `/auction-house/${auctionHouse}`
  const { data } = await instance.post(`${prefix}/bid`, {
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
  buyPrice: number,
  auctionHouse: string
): Promise<Buffer> => {
  const prefix = `/auction-house/${auctionHouse}`
  const { data } = await instance.post(`${prefix}/ask`, {
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
  buyerWallet: string,
  auctionHouse: string
): Promise<Buffer> => {
  const prefix = `/auction-house/${auctionHouse}`
  const { data } = await instance.post(`${prefix}/execute-sale`, {
    wallet,
    sellerWallet: wallet,
    buyerWallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const ListPaymentTokens = async () => {
  const { data } = await instance.get(`/trading/markets`)

  return data
}

export default instance
