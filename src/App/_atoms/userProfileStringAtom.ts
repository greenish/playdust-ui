import { atom } from 'recoil';

const userProfileStringAtom = atom<string|null>({
  key: 'userProfileString',
  default: null
});

export default userProfileStringAtom;
