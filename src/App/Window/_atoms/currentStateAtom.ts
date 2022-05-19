import { selector } from 'recoil';
import type { WindowType } from '../../_types/WindowType';
import currentStateStringAtom from './currentStateStringAtom';

const currentStateAtom = selector<WindowType | null>({
  key: 'currentStateAtom',
  get: ({ get }) => {
    const currentStateString = get(currentStateStringAtom);

    if (currentStateString == null) {
      return null;
    }

    return JSON.parse(currentStateString) as WindowType;
  },
});

export default currentStateAtom;
