import { selector } from 'recoil';
import type { TabType } from './appState';
import appState from './appState';

const activeTab = selector<TabType>({
  key: 'activeTab',
  get: ({ get }) => {
    const { tabs, selectedTabId } = get(appState);
    const found = tabs?.find((tab) => tab.id === selectedTabId);

    return found || tabs[0];
  },
});

export default activeTab;
