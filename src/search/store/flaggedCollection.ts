import { atom } from 'recoil'

export const flaggedModal = atom<boolean>({
  key: 'flaggedModal',
  default: false,
})

export const flaggedId = atom<string>({
  key: 'flaggedId',
  default: '',
})
