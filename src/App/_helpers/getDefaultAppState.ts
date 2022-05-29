import { nanoid } from 'nanoid';
import type { AppStateType } from '../_types/AppStateType';
import type { WindowStateType } from '../_types/WindowStateType';

const newHomeWindow: () => WindowStateType = () => ({
  type: 'home',
  state: '',
  tabId: nanoid(),
});

const getDefaultAppState = (tabId?: string): AppStateType => {
  const homeWindow = newHomeWindow();

  homeWindow.tabId = tabId ?? homeWindow.tabId;

  return {
    tabs: [
      {
        id: homeWindow.tabId,
        windows: [homeWindow],
        selectedWindowIdx: 0,
      },
    ],
    selectedTabId: homeWindow.tabId,
  };
};

export default getDefaultAppState;
