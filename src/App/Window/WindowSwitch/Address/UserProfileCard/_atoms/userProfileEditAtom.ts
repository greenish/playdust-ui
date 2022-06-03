import { atom } from 'recoil';

const userProfileEditAtom = atom({
  key: 'userProfileEditAtom',
  default: false,
});

export default userProfileEditAtom;
