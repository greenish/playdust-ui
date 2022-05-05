import { AlertProps } from '@mui/material';
import { atom } from 'recoil';

type NotificationType = {
  open: boolean;
  message?: string;
  severity?: AlertProps['severity'];
};

const notification = atom<NotificationType>({
  key: 'notification',
  default: {
    open: false,
  },
});

export default notification;
