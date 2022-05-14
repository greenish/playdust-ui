import { atom } from 'Recoil';

const currentStateStringAtom = atom<string | null>({
  key: 'currentStateString',
  default: null,
});

export default currentStateStringAtom;
