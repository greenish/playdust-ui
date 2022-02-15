import { atom } from 'recoil'

type Token = {
  key: string
  expires_at: Date
}

const authToken = atom<Token>({
  key: 'authToken',
  default: {
    key: '',
    expires_at: new Date(),
  },
})

export default authToken
