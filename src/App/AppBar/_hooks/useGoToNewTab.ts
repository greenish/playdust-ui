import usePushWindowHash from '../../_hooks/usePushWindowHash';

const useGoToNewTab = () => {
  const pushWindowHash = usePushWindowHash();

  return () => {
    pushWindowHash({ type: 'home', state: '' }, { newTab: true });
  };
};

export default useGoToNewTab;
