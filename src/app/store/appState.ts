import { nanoid } from 'nanoid'
import { atom, useSetRecoilState } from 'recoil'
import validateAppState from '../helpers/validateAppState'
import type { App, Window } from '../types/App'

export const appState = atom<App>({
  key: 'appState',
  default: {
    tabs: [],
    selectedTabId: undefined,
  },
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

export const useSetSelectedTab = () => {
  const setter = useSetRecoilState(appState)

  return (id?: string) => {
    setter((curr) => ({
      ...curr,
      selectedTabId: id,
    }))
  }
}

export const useAddTab = () => {
  const setter = useSetRecoilState(appState)

  return (newState: Window, id?: string) => {
    const newTab = {
      id: id || nanoid(),
      windows: [newState],
    }

    setter((curr) => ({
      tabs: [...curr.tabs, newTab],
      selectedTabId: newTab.id,
    }))

    return newTab.id
  }
}

export const useSetTabState = () => {
  const setter = useSetRecoilState(appState)

  return (nextState: Window, id: string) => {
    setter((curr) => ({
      selectedTabId: id,
      tabs: curr.tabs.map((tab) => {
        if (tab.id === id) {
          return {
            ...tab,
            windows: [nextState],
          }
        }

        return tab
      }),
    }))
  }
}

export const useRemoveTab = () => {
  const setter = useSetRecoilState(appState)

  return (id: string) => {
    setter((curr) => ({
      ...curr,
      tabs: curr.tabs.filter((tab) => tab.id !== id),
    }))
  }
}
