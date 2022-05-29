import { selector } from 'recoil';
import activeTab from './activeTabAtom';
import type { WindowType } from '../_types/WindowType';

const activeWindowAtom = selector<WindowType>({
  key: 'activeWindowAtom',
  get: ({ get }) => {
    const active = get(activeTab);
    const result = active.windows[active.selectedWindowIdx];

    return result;
  },
});

export default activeWindowAtom;
