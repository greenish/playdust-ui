import { nanoid } from 'nanoid'
import { atom, useSetRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type WindowUnion from '../types/WindowUnion'

const { persistAtom } = recoilPersist()

export interface WindowState {
  state: string
  type: WindowUnion
}

export interface Tab {
  id: string
  windows: WindowState[]
}

export interface Window {
  tabs: Tab[]
  selectedTabId: string | undefined
}

export const windowManager = atom<Window>({
  key: 'windowManagerAtom',
  default: {
    tabs: [],
    selectedTabId: undefined,
  },
  effects: [persistAtom],
})

export const useSetSelectedTab = () => {
  const setter = useSetRecoilState(windowManager)

  return (id?: string) => {
    setter((curr) => ({
      ...curr,
      selectedTabId: id,
    }))
  }
}

export const useAddTab = () => {
  const setter = useSetRecoilState(windowManager)

  return (newState: WindowState) => {
    const newTab = {
      id: nanoid(),
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
  const setter = useSetRecoilState(windowManager)

  return (nextState: WindowState, id: string) => {
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
  const setter = useSetRecoilState(windowManager)

  return (id: string) => {
    setter((curr) => ({
      ...curr,
      tabs: curr.tabs.filter((tab) => tab.id !== id),
    }))
  }
}
