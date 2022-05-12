import { atom } from 'recoil';
import type WindowType from '../../_types/WindowType';

const currentStateAtom = atom<WindowType | undefined>({
  key: 'currentStateAtom',
  default: undefined,
});

export default currentStateAtom;
