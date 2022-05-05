import { useSetRecoilState } from 'recoil';
import appState, { WindowType } from '../_atoms/appState';

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
