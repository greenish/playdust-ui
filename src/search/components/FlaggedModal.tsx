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
import { useRecoilValue, useResetRecoilState } from 'recoil'
import {
  setCollectionCensorStatus,
  setNFTCensorStatus,
} from '../../../helpers/auctionHouseApi'
import * as store from '../store'

enum CensorStatus {
  Censored,
  NSFW,
  Other,
}

const FlaggedModal = () => {
  const [selected, setSelected] = useState(0)
  const [reason, setReason] = useState('')
  const { publicKey } = useWallet()
  const { open, type, id } = useRecoilValue(store.flagged)
  const close = useResetRecoilState(store.flagged)

  const handleSave = () => {
    if (type === 'NFT') {
      setNFTCensorStatus(id, publicKey!.toBase58(), selected)
    } else {
      setCollectionCensorStatus(id, publicKey!.toBase58(), selected)
    }
    close()
  }

  return (
    <Dialog open={open} onClose={() => close()}>
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
        <Button onClick={() => close()}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default FlaggedModal
