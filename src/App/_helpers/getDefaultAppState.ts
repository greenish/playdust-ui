import { nanoid } from 'nanoid';
import type { AppStateType, WindowType } from '../_atoms/appState';

const homeWindow: WindowType = {
  type: 'home',
  state: '',
};

const getDefaultAppState = (idOverride?: string): AppStateType => {
  const id = idOverride || nanoid();

  return {
    tabs: [
      {
        id,
        windows: [homeWindow],
        selectedWindowIdx: 0,
      },
    ],
    selectedTabId: id,
  };
};

export default getDefaultAppState;
