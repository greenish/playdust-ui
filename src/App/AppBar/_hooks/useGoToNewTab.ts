import { nanoid } from 'nanoid';
import usePushWindowHash from '../../_hooks/usePushWindowHash';

const useGoToNewTab = () => {
  const pushWindowHash = usePushWindowHash();

  return () => {
    pushWindowHash({ type: 'home', state: '', tabId: nanoid() });
  };
};

export default useGoToNewTab;
