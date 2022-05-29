import { useSetRecoilState } from 'recoil';
import appState from '../_atoms/appStateAtom';
import type { WindowStateType } from '../_types/WindowStateType';

const useSetCurrentWindowState = () => {
  const setter = useSetRecoilState(appState);

  return (windowState: WindowStateType) => {
    setter((curr) => ({
      ...curr,
      selectedTabId: windowState.tabId,
      tabs: curr.tabs.map((tab) => {
        if (tab.id === windowState.tabId) {
          const changed = {
            ...tab,
            windows: tab.windows.map((window, idx) => {
              if (idx === tab.selectedWindowIdx) {
                return windowState;
              }

              return window;
            }),
          };

          return changed;
        }

        return tab;
      }),
    }));
  };
};

export default useSetCurrentWindowState;
