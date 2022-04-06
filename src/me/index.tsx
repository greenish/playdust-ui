import styled from '@emotion/styled'
import { Button, Typography } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import base58 from 'bs58'
import { Suspense } from 'react'
import { useCookies } from 'react-cookie'
import instance, { GetAuthToken, GetNonce } from '../common/helpers/playdustApi'
import OwnedTokens from './components/OwnedTokens'
import ProfileInfo from './components/ProfileInfo'

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
  const TOKEN_TTL = 60 * 1000
  const wallet = useWallet()
  const [cookies, setCookie] = useCookies(['authToken', 'expires_at', 'nonce'])

  const signIn = () => {
    const { publicKey, signMessage, connected } = wallet
    const pubKey = publicKey!.toBase58()
    let nonceToken = ''
    if (connected && !cookies.authToken) {
      GetNonce(pubKey)
        .then((nonce) => {
          nonceToken = nonce
          const nonceArray = new TextEncoder().encode(nonce)
          return signMessage!(nonceArray)
        })
        .then((signature) => {
          const accountSignature = base58.encode(signature)
          return GetAuthToken(pubKey, accountSignature, nonceToken)
        })
        .then(({ token, nonce }) => {
          nonceToken = nonce
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const expires_at = new Date(Date.now() + TOKEN_TTL).getTime()
          setCookie('nonce', nonce, { path: '/' })
          setCookie('authToken', token, { path: '/' })
          setCookie('expires_at', expires_at, {
            path: '/',
          })
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
          ) : (
            <Suspense fallback={<div />}>
              <ProfileInfo publicKey={wallet.publicKey} />
            </Suspense>
          )}
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
