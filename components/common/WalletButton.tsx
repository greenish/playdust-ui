import { Person } from '@mui/icons-material'
import {
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import base58 from 'bs58'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRecoilState } from 'recoil'
import instance, {
  GetAuthToken,
  GetNonce,
  RefreshToken,
} from '../../helpers/auctionHouseApi'
import { shortenPublicKey } from '../../helpers/utils'
import * as store from '../../store'

const WalletButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const walletModal = useWalletModal()
  const wallet = useWallet()
  const open = !!anchorEl
  const [solanaClusters, setSolanaClusters] = useRecoilState(
    store.solanaClusters
  )
  const [authToken, setAuthToken] = useRecoilState(store.authToken)
  const [cookies, setCookie] = useCookies(['nonce'])

  useEffect(() => {
    const { publicKey, signMessage, connected } = wallet
    if (connected && !authToken.key.length) {
      let nonceToken = ''
      GetNonce(publicKey!.toBase58())
        .then((nonce) => {
          nonceToken = nonce
          setCookie('nonce', nonce, { path: '/' })
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
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
          setAuthToken({ key: token, expires_at: new Date(Date.now() + 60000) })
          instance.interceptors.request.use(
            async (config) => {
              if (authToken.expires_at > new Date()) {
                const token = await RefreshToken(
                  publicKey!.toBase58(),
                  nonceToken
                )
                setAuthToken({
                  key: token,
                  expires_at: new Date(Date.now() + 60000),
                })
                instance.defaults.headers.common[
                  'Authorization'
                ] = `Bearer ${token}`
                return config
              }
            },
            (error) => {
              return Promise.reject(error)
            }
          )
        })
        .catch((e) => console.error(e))
    }
  }, [wallet.connected])

  const buttonProps =
    wallet.connected && wallet.publicKey
      ? {
          children: shortenPublicKey(wallet.publicKey),
          startIcon: <Person />,
          onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
            setAnchorEl(event.currentTarget),
        }
      : {
          children: 'Connect Wallet',
          onClick: () => walletModal.setVisible(true),
        }

  return (
    <>
      <Button {...buttonProps} variant="outlined" />
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          sx={{ p: 2 }}
          onClick={() => {
            wallet.disconnect()
            setAnchorEl(null)
          }}
        >
          Disconnect
        </MenuItem>
        <MenuItem sx={{ p: 2 }}>
          <Link href="/me">
            <a>View my Tokens</a>
          </Link>
        </MenuItem>
        <MenuItem sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Network</InputLabel>
            <Select
              value={solanaClusters.selectedIndex}
              label="Network"
              onChange={(evt) => {
                const nextIndex = evt.target.value
                if (typeof nextIndex === 'number') {
                  setSolanaClusters((curr) => ({
                    ...curr,
                    selectedIndex: nextIndex,
                  }))
                }
              }}
            >
              {solanaClusters.clusters.map((cluster, idx) => (
                <MenuItem value={idx} key={cluster.network}>
                  {cluster.network}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MenuItem>
      </Menu>
    </>
  )
}

export default WalletButton
