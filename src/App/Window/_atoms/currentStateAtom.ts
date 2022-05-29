import { atom } from 'recoil';
import { WindowType } from '../../_types/WindowType';

const currentStateAtom = atom<WindowType | null>({
  key: 'currentState',
  default: null,
});

export default currentStateAtom;
