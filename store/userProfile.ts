import { atom } from 'recoil'

const defaultProfile = {
  username: '',
  email: '',
  bio: '',
  twitter: '',
  picture: '',
}

const userProfile = atom({
  key: 'userProfile',
  default: defaultProfile,
})

export default userProfile
