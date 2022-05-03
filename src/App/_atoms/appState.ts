import { atom } from 'recoil'
import getDefaultAppState from '../_helpers/getDefaultAppState'
import validateAppState from '../_helpers/validateAppState'
import WindowUnion from '../_types/WindowUnionType'

export interface WindowType {
  state: string
  type: WindowUnion
  images?: string[]
}

export interface TabType {
  id: string
  windows: WindowType[]
  selectedWindowIdx: number
}

export interface AppStateType {
  tabs: TabType[]
  selectedTabId: string
}

const appState = atom<AppStateType>({
  key: 'appState',
  default: getDefaultAppState(),
  effects: [
    ({ setSelf, onSet, trigger, node }) => {
      if (typeof window === 'undefined') {
        return
      }

      const { key } = node

      const savedValue = localStorage.getItem(key)

      if (trigger === 'get' && savedValue) {
        const isValid = validateAppState(savedValue)

        if (!isValid) {
          return localStorage.removeItem(key)
        }

        setSelf(JSON.parse(savedValue))
      }

      onSet((newValue, _, isReset) => {
        if (isReset) {
          return localStorage.removeItem(key)
        }

        const nextValue = JSON.stringify(newValue)

        if (validateAppState(nextValue)) {
          localStorage.setItem(key, JSON.stringify(newValue))
        }
      })
    },
  ],
})

export default appState
