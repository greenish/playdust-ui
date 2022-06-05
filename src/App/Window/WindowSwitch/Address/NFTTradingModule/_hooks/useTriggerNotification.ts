import { AlertProps } from '@mui/material';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import notificationAtom from '../../../../../_atoms/notificationAtom';

const useTriggerNotification = () => {
  const setter = useSetRecoilState(notificationAtom);

  return useCallback(
    (message: string, severity: AlertProps['severity']) => {
      setter({
        open: true,
        message,
        severity,
      });
    },
    [setter]
  );
};

export default useTriggerNotification;
