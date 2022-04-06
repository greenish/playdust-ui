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
import { setFlagCollection, setFlagNFT } from '../../common/helpers/playdustApi'
import * as store from '../store'

const FlaggedModal = () => {
  const [selected, setSelected] = useState('')
  const [reason, setReason] = useState('')
  const { publicKey } = useWallet()
  const { open, type, id } = useRecoilValue(store.flagged)
  const close = useResetRecoilState(store.flagged)

  const handleSave = () => {
    const reasonSelected = selected !== 'other' ? selected : reason
    if (type === 'NFT') {
      setFlagNFT(id, publicKey!.toBase58(), reasonSelected)
    } else {
      setFlagCollection(id, publicKey!.toBase58(), reasonSelected)
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
            onChange={(e) => setSelected(e.target.value)}
          >
            <MenuItem value="Explicit content">
              Item has explicit content
            </MenuItem>
            <MenuItem value="NSFW">
              Item is not apropied for work (NSFW)
            </MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        {selected === 'other' ? (
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
