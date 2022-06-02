import { atom } from 'recoil';
import UserProfileType from '../../../../../_types/UserProfileType';

type UserProfileForm = {
  edit: boolean;
  state: Partial<UserProfileType>;
};

const userProfileFormAtom = atom<UserProfileForm>({
  key: 'userProfileFormAtom',
  default: {
    edit: false,
    state: {},
  },
});

export default userProfileFormAtom;
