import { atom } from 'recoil'
import { Profile } from '../types/profile'

const defaultProfile = {
  username: '',
  email: '',
  bio: '',
  twitter: '',
  picture: '',
  roles: [],
}

const userProfile = atom<Profile>({
  key: 'userProfile',
  default: defaultProfile,
})

export default userProfile
