import { AlertProps } from '@mui/material';
import { useSetRecoilState } from 'recoil';
import notificationAtom from '../../../../../../_atoms/notificationAtom';

const useTriggerNotification = () => {
  const setter = useSetRecoilState(notificationAtom);

  return (message: string, severity: AlertProps['severity']) => {
    setter({
      open: true,
      message,
      severity,
    });
  };
};

export default useTriggerNotification;
