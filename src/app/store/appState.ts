import { nanoid } from 'nanoid'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import validateAppState from '../helpers/validateAppState'
import type { App, Window } from '../types/App'

const homeWindow: Window = {
  type: 'home',
  state: '',
}

const getDefaultValue = (idOverride?: string): App => {
  const id = idOverride || nanoid()

  return {
    tabs: [
      {
        id,
        windows: [homeWindow],
      },
    ],
    selectedTabId: id,
  }
}

export const appState = atom<App>({
  key: 'appState',
  default: getDefaultValue(),
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

  return (id: string) => {
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

    return newTab
  }
}

export const useAddHomeTab = () => {
  const addTab = useAddTab()

  return () => {
    return addTab({ type: 'home', state: '' })
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
  const [curr, setter] = useRecoilState(appState)

  const getNextValue = () => {
    const { tabs, selectedTabId, ...rest } = curr

    if (tabs.length === 1) {
      return getDefaultValue(tabs[0].id)
    }

    const indexOf = tabs.findIndex((tab) => tab.id === selectedTabId)
    const filtered = tabs.filter((_tab, idx) => idx !== indexOf)

    const base = {
      ...rest,
      tabs: filtered,
    }

    const tabAtIndex = filtered[indexOf]

    if (tabAtIndex) {
      return {
        ...base,
        selectedTabId: tabAtIndex.id,
      }
    }

    const tabBeforeIndex = filtered[indexOf - 1]

    return {
      ...base,
      selectedTabId: tabBeforeIndex.id,
    }
  }

  return () => {
    const nextValue: App = getNextValue()
    const activeTab = nextValue.tabs.find(
      (tab) => tab.id === nextValue.selectedTabId
    )

    setter(nextValue)

    return activeTab
  }
}
