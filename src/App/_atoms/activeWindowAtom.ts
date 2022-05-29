import { selector } from 'recoil';
import type { WindowStateType } from '../_types/WindowStateType';
import activeTab from './activeTabAtom';

const activeWindowAtom = selector<WindowStateType>({
  key: 'activeWindowAtom',
  get: ({ get }) => {
    const active = get(activeTab);
    const result = active.windows[active.selectedWindowIdx];

    return result;
  },
});

export default activeWindowAtom;
