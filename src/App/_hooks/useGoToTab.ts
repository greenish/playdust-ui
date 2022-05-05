import type { TabType } from '../_atoms/appState';
import usePushWindowHash from './usePushWindowHash';

const useGoToTab = () => {
  const pushWindowHash = usePushWindowHash();

  return (tab: TabType) => {
    const activeWindow = tab.windows[tab.selectedWindowIdx];

    pushWindowHash(activeWindow, { tabOverride: tab.id });
  };
};

export default useGoToTab;
