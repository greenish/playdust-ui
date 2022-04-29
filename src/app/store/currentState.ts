import { atom } from 'recoil'
import { Window } from '../types/App'

export const currentState = atom<Window | undefined>({
  key: 'currentState',
  default: undefined,
})
