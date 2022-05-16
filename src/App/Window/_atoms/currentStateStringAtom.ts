import { atom } from 'recoil';

const currentStateStringAtom = atom<string | null>({
  key: 'currentStateString',
  default: null,
});

export default currentStateStringAtom;
