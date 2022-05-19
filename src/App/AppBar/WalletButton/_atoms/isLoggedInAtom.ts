import { noWait, selector } from 'recoil';
import userProfileAtom from './userProfileAtom';

const isLoggedInAtom = selector<boolean>({
  key: 'isLoggedInAtom',
  get: ({ get }) => {
    const profile = get(noWait(userProfileAtom));

    if (profile.state === 'hasValue') {
      return profile.contents !== null;
    }

    return false;
  },
});

export default isLoggedInAtom;
