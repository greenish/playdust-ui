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
import { PublicKey } from '@solana/web3.js'
import Link from 'next/link'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import * as store from '../../store'

const shortenPublicKey = (pk: PublicKey) => {
  const pkString = pk.toString()
  const { length } = pkString

  return `${pkString.slice(0, 4)}...${pkString.slice(length - 4)}`
}

const WalletButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const walletModal = useWalletModal()
  const wallet = useWallet()
  const open = !!anchorEl
  const [solanaClusters, setSolanaClusters] = useRecoilState(
    store.solanaClusters
  )

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
