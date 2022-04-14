import { atom } from 'recoil'
import ComposedQueryType from '../types/ComposedQueryType'

export const searchQuery = atom<ComposedQueryType>({
  key: 'searchQuery',
  default: [],
})
