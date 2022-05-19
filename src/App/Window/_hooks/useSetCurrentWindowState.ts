import { useSetRecoilState } from 'recoil';
import appState from '../../_atoms/appStateAtom';
import type { WindowType } from '../../_types/WindowType';

const useSetCurrentWindowState = () => {
  const setter = useSetRecoilState(appState);

  return (windowState: WindowType, selectedTabId: string) => {
    setter((curr) => ({
      ...curr,
      selectedTabId,
      tabs: curr.tabs.map((tab) => {
        if (tab.id === selectedTabId) {
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
