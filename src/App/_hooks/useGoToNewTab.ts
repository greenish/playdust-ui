import usePushWindowHash from './usePushWindowHash';

const useGoToNewTab = () => {
  const pushWindowHash = usePushWindowHash();

  return () => {
    pushWindowHash({ type: 'home', state: '' }, { newTab: true });
  };
};

export default useGoToNewTab;
