import { TextField } from '@mui/material'

const placeholder =
  'Search for blocks, accounts, transactions, programs, and tokens'

export const AddressInput = () => {
  return (
    <>
      <TextField
        id="outlined-basic"
        variant="filled"
        placeholder={placeholder}
        fullWidth
      />
    </>
  )
}
