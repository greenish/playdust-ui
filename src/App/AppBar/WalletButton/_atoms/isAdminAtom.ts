import { noWait, selector } from 'recoil';
import userProfileAtom from './userProfileAtom';

const isAdminAtom = selector<boolean>({
  key: 'isAdminAtom',
  get: ({ get }) => {
    const profile = get(noWait(userProfileAtom));

    if (profile.state === 'hasValue') {
      return !!profile.contents?.roles.includes('admin');
    }

    return false;
  },
});

export default isAdminAtom;
