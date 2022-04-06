import { Alert, Snackbar } from '@mui/material'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import * as store from '../store'

const Notifications = () => {
  const { open, message, severity } = useRecoilValue(store.notification)
  const reset = useResetRecoilState(store.notification)

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={reset}
    >
      <Alert onClose={reset} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notifications
