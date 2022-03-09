import styled from '@emotion/styled'
import { Button, Typography } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import base58 from 'bs58'
import { Suspense } from 'react'
import { useCookies } from 'react-cookie'
import OwnedTokens from '../components/token/OwnedTokens'
import instance from '../helpers/api'
import {
  GetAuthToken,
  GetNonce,
  RefreshToken,
} from '../helpers/auctionHouseApi'

const ParentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
`

const SignInButton = styled(Button)`
  margin-bottom: 16px;
`

const Me = () => {
  const TOKEN_TTL = 15 * 60 * 1000
  const wallet = useWallet()
  const [cookies, setCookie] = useCookies(['authToken', 'expires_at'])

  const signIn = () => {
    const { publicKey, signMessage, connected } = wallet
    if (connected && !cookies.authToken) {
      let nonceToken = ''
      GetNonce(publicKey!.toBase58())
        .then((nonce) => {
          nonceToken = nonce
          const nonceArray = new TextEncoder().encode(nonce)
          return signMessage!(nonceArray)
        })
        .then((signature) => {
          const accountSignature = base58.encode(signature)
          return GetAuthToken(
            publicKey!.toBase58(),
            accountSignature,
            nonceToken
          )
        })
        .then((token) => {
          setCookie('authToken', token, { path: '/' })
          setCookie('expires_at', new Date(Date.now() + TOKEN_TTL).getTime(), {
            path: '/',
          })
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
          instance.interceptors.request.use(
            async (config) => {
              if (new Date(cookies.expires_at) <= new Date()) {
                const token = await RefreshToken(
                  publicKey!.toBase58(),
                  nonceToken
                )
                setCookie('authToken', token, { path: '/' })
                setCookie(
                  'expires_at',
                  new Date(Date.now() + TOKEN_TTL).getTime(),
                  {
                    path: '/',
                  }
                )
                instance.defaults.headers.common[
                  'Authorization'
                ] = `Bearer ${token}`
              }
              return config
            },
            (error) => {
              return Promise.reject(error)
            }
          )
        })
        .catch((e) => console.error(e))
    }
  }

  return (
    <ParentContainer>
      {wallet.connected && wallet.publicKey ? (
        <>
          {!cookies.authToken ? (
            <SignInButton variant="contained" onClick={() => signIn()}>
              Sign In
            </SignInButton>
          ) : null}
          <Typography variant="h5" gutterBottom>
            My Tokens
          </Typography>
          <Suspense fallback={<div />}>
            <OwnedTokens publicKey={wallet.publicKey} />
          </Suspense>
        </>
      ) : (
        <i>Connect wallet to view tokens</i>
      )}
    </ParentContainer>
  )
}

export default Me
