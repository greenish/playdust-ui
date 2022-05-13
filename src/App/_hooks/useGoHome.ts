import usePushWindowHash from './usePushWindowHash';

const useGoHome = () => {
  const pushWindowHash = usePushWindowHash();

  return () => {
    pushWindowHash({ type: 'home', state: '' });
  };
};

export default useGoHome;
