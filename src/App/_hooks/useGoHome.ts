import { useRecoilValue } from 'recoil';
import windowStateAtom from '../_atoms/windowStateAtom';
import usePushWindowHash from './usePushWindowHash';

const useGoHome = () => {
  const pushWindowHash = usePushWindowHash();
  const windowState = useRecoilValue(windowStateAtom);

  return () => {
    pushWindowHash({ type: 'home', state: '', tabId: windowState.tabId });
  };
};

export default useGoHome;
