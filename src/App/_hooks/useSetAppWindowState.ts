import { useSetRecoilState } from 'recoil';
import appState from '../_atoms/appStateAtom';
import AppWindowType from '../_types/AppWindowType';

const useSetAppWindowState = () => {
  const setter = useSetRecoilState(appState);

  return (appWindow: Partial<AppWindowType>, tabId: string) => {
    setter((curr) => ({
      ...curr,
      selectedTabId: tabId,
      tabs: curr.tabs.map((tab) => {
        if (tab.id === tabId) {
          const changed = {
            ...tab,
            windows: tab.windows.map((window, idx) => {
              if (idx === tab.selectedWindowIdx) {
                return {
                  ...window,
                  ...appWindow,
                };
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

export default useSetAppWindowState;
