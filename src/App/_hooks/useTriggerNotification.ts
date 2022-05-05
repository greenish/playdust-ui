import { AlertProps } from '@mui/material';
import { useSetRecoilState } from 'recoil';
import notification from '../_atoms/notifcation';

const useTriggerNotfication = () => {
  const setter = useSetRecoilState(notification);

  return (message: string, severity: AlertProps['severity']) => {
    setter({
      open: true,
      message,
      severity,
    });
  };
};

export default useTriggerNotfication;
