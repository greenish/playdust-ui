import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import {
  setCollectionCensorStatus,
  setNFTCensorStatus,
} from '../../helpers/auctionHouseApi'

type FlaggedModalProps = {
  open: boolean
  setOpen: Function
  id: string
  type: string
}

enum CensorStatus {
  Censored,
  NSFW,
  Other,
}

const FlaggedModal = ({ open, setOpen, id, type }: FlaggedModalProps) => {
  const [selected, setSelected] = useState(0)
  const [reason, setReason] = useState('')
  const { publicKey } = useWallet()

  const handleSave = () => {
    if (type === 'NFT') {
      setNFTCensorStatus(id, publicKey!.toBase58(), selected)
    } else {
      setCollectionCensorStatus(id, publicKey!.toBase58(), selected)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Report</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the reason that represent better your inconvenience
        </DialogContentText>
        <FormControl fullWidth sx={{ margin: '16px 0' }}>
          <InputLabel id="censor-label">Reason</InputLabel>
          <Select
            labelId="censor-label"
            value={selected}
            label="Reason"
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            <MenuItem value={CensorStatus.Censored}>
              Item has explicit content
            </MenuItem>
            <MenuItem value={CensorStatus.NSFW}>
              Item is not apropied for work (NSFW)
            </MenuItem>
            <MenuItem value={CensorStatus.Other}>Other</MenuItem>
          </Select>
        </FormControl>
        {selected === CensorStatus.Other ? (
          <TextField
            label="Other"
            variant="outlined"
            sx={{ width: '100%' }}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default FlaggedModal
