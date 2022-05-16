import { atom } from 'recoil'
import ProfileType from '../../App/_types/ProfileType'

const defaultProfile = {
  username: '',
  email: '',
  bio: '',
  twitter: '',
  picture: '',
  roles: [],
}

export const userProfile = atom<ProfileType>({
  key: 'userProfile',
  default: defaultProfile,
})
