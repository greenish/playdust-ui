import { selector } from 'recoil';
import type { WindowType } from '../_types/WindowType';
import activeTab from './activeTabAtom';

const activeWindowAtom = selector<WindowType>({
  key: 'activeWindowAtom',
  get: ({ get }) => {
    const active = get(activeTab);
    const result = active.windows[active.selectedWindowIdx];

    return result;
  },
});

export default activeWindowAtom;
