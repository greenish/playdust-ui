import { nanoid } from 'nanoid';
import { useRecoilState } from 'recoil';
import appState from '../../_atoms/appStateAtom';
import type { WindowStateType } from '../../_types/WindowStateType';

const useAddTab = () => {
  const [state, setter] = useRecoilState(appState);

  return (newState: WindowStateType, id?: string, addAtCurrIdx?: boolean) => {
    const newTab = {
      id: id || nanoid(),
      windows: [newState],
      selectedWindowIdx: 0,
    };

    const insertAt = addAtCurrIdx
      ? state.tabs.findIndex((tab) => tab.id === state.selectedTabId)
      : state.tabs.length;

    const tabs = [
      ...state.tabs.slice(0, insertAt),
      newTab,
      ...state.tabs.slice(insertAt),
    ];

    setter({
      tabs,
      selectedTabId: newTab.id,
    });

    return newTab;
  };
};

export default useAddTab;
