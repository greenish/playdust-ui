import { atom } from 'recoil'
import type Profile from '../types/Profile'

const defaultProfile = {
  username: '',
  email: '',
  bio: '',
  twitter: '',
  picture: '',
  roles: [],
}

export const userProfile = atom<Profile>({
  key: 'userProfile',
  default: defaultProfile,
})
