import { atom, selector } from 'recoil'
import ProfileType from '../_types/ProfileType'
import userProfileStringAtom from './userProfileStringAtom';

const defaultProfile = {
  username: '',
  email: '',
  bio: '',
  twitter: '',
  picture: '',
  roles: [],
}

const userProfileAtom = selector<ProfileType>({
  key: 'solanaClusterAtom',
  get: ({ get }) => {
    const userProfileString = get(userProfileStringAtom);

    if(userProfileString === null) {
      return defaultProfile;
    }

    return JSON.parse(userProfileString);
  }
});

export default userProfileAtom;
