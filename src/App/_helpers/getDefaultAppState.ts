import { nanoid } from 'nanoid';
import type { AppStateType } from '../_types/AppStateType';
import type { WindowType } from '../_types/WindowType';

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
