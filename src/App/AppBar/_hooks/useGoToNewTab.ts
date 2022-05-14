import safePromise from '../../_helpers/safePromise';
import usePushWindowHash from '../../_hooks/usePushWindowHash';

const useGoToNewTab = () => {
  const pushWindowHash = usePushWindowHash();

  return () => {
    safePromise(pushWindowHash({ type: 'home', state: '' }, { newTab: true }));
  };
};

export default useGoToNewTab;
