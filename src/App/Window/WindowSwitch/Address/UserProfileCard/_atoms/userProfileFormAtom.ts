import { atom } from 'recoil';

type UserProfileForm = {
  edit: boolean;
  editPicture: boolean;
};

const userProfileFormAtom = atom<UserProfileForm>({
  key: 'userProfileFormAtom',
  default: {
    edit: false,
    editPicture: false,
  },
});

export default userProfileFormAtom;
