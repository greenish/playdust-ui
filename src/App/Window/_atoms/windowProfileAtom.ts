import { atom } from 'recoil';
import UserProfileType from '../../_types/UserProfileType';

const windowProfileAtom = atom<UserProfileType | null>({
  key: 'windowProfileAtom',
  default: null,
});

export default windowProfileAtom;
