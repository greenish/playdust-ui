import { Person } from '@mui/icons-material'
import {
  Fab,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRecoilState } from 'recoil'
import { autoRefresh } from '../../common/helpers/playdustApi'
import { shortenPublicKey } from '../../common/helpers/utils'
import * as store from '../store'

const WalletButton = ({ active }: { active: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const walletModal = useWalletModal()
  const wallet = useWallet()
  const open = !!anchorEl
  const [solanaClusters, setSolanaClusters] = useRecoilState(
    store.solanaClusters
  )
  const router = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies(['authToken', 'nonce'])

  const buttonProps =
    wallet.connected && wallet.publicKey
      ? {
          children: shortenPublicKey(wallet.publicKey),
          onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
            setAnchorEl(event.currentTarget),
        }
      : {
          children: 'Connect Wallet',
          onClick: () => walletModal.setVisible(true),
        }

  useEffect(() => {
    if (cookies && wallet.connected) {
      const pubKey = wallet.publicKey?.toBase58()!
      autoRefresh(pubKey, cookies.nonce, cookies.authToken, setCookie)
    }
  }, [wallet])

  return (
    <>
      <Fab {...buttonProps} size="small" color={active ? 'primary' : 'default'}>
        <Person />
      </Fab>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ ml: 2 }}
      >
        <Typography sx={{ p: 2 }}>
          {wallet.publicKey && shortenPublicKey(wallet.publicKey)}
        </Typography>
        <MenuItem sx={{ p: 2 }} onClick={() => router.push('/me')}>
          View Profile
        </MenuItem>
        <MenuItem
          sx={{ p: 2 }}
          onClick={() => {
            wallet.disconnect()
            removeCookie('authToken')
            setAnchorEl(null)
          }}
        >
          Disconnect
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
