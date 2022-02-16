import { atom } from 'recoil'

// Use to invalidate recoil caches
export const pageIdx = atom({
  key: 'pageIdx',
  default: 0,
})
