import { atom } from 'recoil';

const searchQueryActiveNodeIdAtom = atom<string | null>({
  key: 'searchQueryActiveNodeIdAtom',
  default: null,
});

export default searchQueryActiveNodeIdAtom;
