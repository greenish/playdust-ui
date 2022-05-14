import { atom, selector } from 'recoil';
import type WindowType from '../../_types/WindowType';
import currentStateStringAtom from './currentStateStringAtom';

const currentStateAtom = selector<WindowType | undefined>({
  key: 'currentStateAtom',
  get: ({ get }) => {
    const currentStateString =  get(currentStateStringAtom);

    if(currentStateString == null) {
      return null;
    }

    return JSON.parse(currentStateString); 
  },
});


export default currentStateAtom;
