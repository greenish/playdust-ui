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
        selectedWindowIdx: 0,
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
  const [state, setter] = useRecoilState(appState)

  return (newState: Window, id?: string, addAtCurrIdx?: boolean) => {
    const newTab = {
      id: id || nanoid(),
      windows: [newState],
      selectedWindowIdx: 0,
    }

    const insertAt = addAtCurrIdx
      ? state.tabs.findIndex((tab) => tab.id === state.selectedTabId)
      : state.tabs.length

    const tabs = [
      ...state.tabs.slice(0, insertAt),
      newTab,
      ...state.tabs.slice(insertAt),
    ]

    setter({
      tabs,
      selectedTabId: newTab.id,
    })

    return newTab
  }
}

export const useAddHomeTab = () => {
  const addTab = useAddTab()

  return () => {
    return addTab({ type: 'home', state: '' })
  }
}

export const useSetCurrentWindowState = () => {
  const setter = useSetRecoilState(appState)

  return (windowState: Window, selectedTabId: string) => {
    setter((curr) => ({
      ...curr,
      selectedTabId,
      tabs: curr.tabs.map((tab) => {
        if (tab.id === selectedTabId) {
          const changed = {
            ...tab,
            windows: tab.windows.map((window, idx) => {
              if (idx === tab.selectedWindowIdx) {
                return windowState
              }

              return window
            }),
          }

          return changed
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
