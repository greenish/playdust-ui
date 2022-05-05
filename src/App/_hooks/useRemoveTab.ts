import { useRecoilState } from 'recoil';
import type { AppStateType } from '../_atoms/appState';
import appState from '../_atoms/appState';
import getDefaultAppState from '../_helpers/getDefaultAppState';
import usePushWindowHash from './usePushWindowHash';

const useRemoveTab = () => {
  const [curr, setter] = useRecoilState(appState);
  const pushWindowHash = usePushWindowHash();

  const getNextValue = () => {
    const { tabs, selectedTabId, ...rest } = curr;

    if (tabs.length === 1) {
      return getDefaultAppState(tabs[0].id);
    }

    const indexOf = tabs.findIndex((tab) => tab.id === selectedTabId);
    const filtered = tabs.filter((_tab, idx) => idx !== indexOf);

    const base = {
      ...rest,
      tabs: filtered,
    };

    const tabAtIndex = filtered[indexOf];

    if (tabAtIndex) {
      return {
        ...base,
        selectedTabId: tabAtIndex.id,
      };
    }

    const tabBeforeIndex = filtered[indexOf - 1];

    return {
      ...base,
      selectedTabId: tabBeforeIndex.id,
    };
  };

  return () => {
    const nextValue: AppStateType = getNextValue();
    const activeTab = nextValue.tabs.find(
      (tab) => tab.id === nextValue.selectedTabId
    );

    setter(nextValue);

    if (activeTab) {
      const activeWindow = activeTab.windows[activeTab.selectedWindowIdx];

      pushWindowHash(activeWindow, { tabOverride: activeTab.id });
    }
  };
};

export default useRemoveTab;
