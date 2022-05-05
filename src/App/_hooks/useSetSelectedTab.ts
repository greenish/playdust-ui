import { useSetRecoilState } from 'recoil';
import appState from '../_atoms/appState';

const useSetSelectedTab = () => {
  const setter = useSetRecoilState(appState);

  return (id: string) => {
    setter((curr) => ({
      ...curr,
      selectedTabId: id,
    }));
  };
};

export default useSetSelectedTab;
