import { AlertProps } from '@mui/material'
import { atom, useSetRecoilState } from 'recoil'

type NotificationInput = {
  open: boolean
  message?: string
  severity?: AlertProps['severity']
}

const notification = atom<NotificationInput>({
  key: 'notification',
  default: {
    open: false,
  },
})

export const useTriggerNotfication = () => {
  const setter = useSetRecoilState(notification)

  return (message: string, severity: AlertProps['severity']) => {
    setter({
      open: true,
      message,
      severity,
    })
  }
}

export default notification
