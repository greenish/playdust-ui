import { atom } from 'recoil';
import UserProfileType from '../../../../../_types/UserProfileType';

type UserProfileForm = {
  edit: boolean;
  editPicture: boolean;
  state: Partial<UserProfileType>;
};

const userProfileFormAtom = atom<UserProfileForm>({
  key: 'userProfileFormAtom',
  default: {
    edit: false,
    editPicture: false,
    state: {},
  },
});

export default userProfileFormAtom;
