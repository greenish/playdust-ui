import { Person } from '@mui/icons-material'
import { Button, Menu, MenuItem } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { PublicKey } from '@solana/web3.js'
import Link from 'next/link'
import { useState } from 'react'

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
      </Menu>
    </>
  )
}

export default WalletButton
