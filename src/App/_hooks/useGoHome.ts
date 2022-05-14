import safePromise from '../_helpers/safePromise';
import usePushWindowHash from './usePushWindowHash';

const useGoHome = () => {
  const pushWindowHash = usePushWindowHash();

  return () => {
    safePromise(pushWindowHash({ type: 'home', state: '' }));
  };
};

export default useGoHome;
