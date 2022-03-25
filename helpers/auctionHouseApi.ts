import axios, { AxiosInstance } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { Profile } from '../types/profile'

const instance: AxiosInstance = axios.create({
  baseURL: `/playdust-api`,
})

const TREASURY_MINT = 'So11111111111111111111111111111111111111112'

const prefix = `/auction-house/${TREASURY_MINT}`

export const makeNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<Buffer> => {
  const { data } = await instance.post(`${prefix}/bid`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const cancelNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<Buffer> => {
  const { data } = await instance.post(`${prefix}/cancel-bid`, {
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
): Promise<any> => {
  const { data } = await instance.post(`${prefix}/ask`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const cancelNFTListing = async (
  wallet: string,
  mint: string,
  buyPrice: number
): Promise<any> => {
  const { data } = await instance.post(`${prefix}/cancel-ask`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const executeNFTSale = async (
  requestData: any,
  txBuff: number[]
): Promise<any> => {
  const { data } = await instance.post(`${prefix}/execute`, {
    ...requestData,
    txBuff,
  })

  return data
}

export const ListPaymentTokens = async () => {
  const { data } = await instance.get(`/trading/markets`)

  return data
}

export const GetAllOrders = async (mint: string) => {
  const { data } = await instance.get(`/trading/${mint}/orders`)

  return data
}

export const GetNonce = async (wallet: string): Promise<string> => {
  const { data } = await instance.post('/authentication/nonce', {
    wallet,
  })

  return data.nonce
}

export const GetAuthToken = async (
  wallet: string,
  signature: string,
  nonce: string
) => {
  const { data } = await instance.post('/authentication/token', {
    wallet,
    signature,
    nonce,
  })

  return data
}

export const RefreshToken = async (wallet: string, nonce: string) => {
  const { data } = await instance.post('/authentication/refresh-token', {
    wallet,
    nonce,
  })

  return data.token
}

export const GetUserProfile = async (wallet: string, nonce: string) => {
  const { data } = await instance.get(`/user-profile/${wallet}?nonce=${nonce}`)

  return data
}

export const UpdateProfile = async (
  profile: Profile,
  wallet: string,
  nonce: string
) => {
  try {
    await instance.post(`/user-profile/${wallet}`, { ...profile, nonce })
  } catch (e) {
    console.log(e)
  }
}

export const autoRefresh = (
  pubKey: string,
  nonce: string,
  authToken: string
) => {
  instance.defaults.headers.common.Authorization = `Bearer ${authToken}`
  createAuthRefreshInterceptor(
    instance,
    (failedRequest) =>
      RefreshToken(pubKey, nonce)
        .then((token) => {
          failedRequest.response.config.headers[
            'Authorization'
          ] = `Bearer ${token}`
          return Promise.resolve()
        })
        .catch(() => Promise.reject()),
    {
      statusCodes: [401, 403, 400],
    }
  )
}

export default instance
