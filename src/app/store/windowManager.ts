import { nanoid } from 'nanoid'
import { atom, useSetRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type WindowUnion from '../types/WindowUnion'

const { persistAtom } = recoilPersist()

export interface WindowState {
  value: string
  type: WindowUnion
}

export interface Tab {
  id: string
  state: WindowState[]
}

export interface Window {
  tabs: Tab[]
  selectedTabId: string | undefined
}

export const window = atom<Window>({
  key: 'windowManager',
  default: {
    tabs: [],
    selectedTabId: undefined,
  },
  effects: [persistAtom],
})

export const useSetSelectedTab = () => {
  const setter = useSetRecoilState(window)

  return (id?: string) => {
    setter((curr) => ({
      ...curr,
      selectedTabId: id,
    }))
  }
}

export const useAddTab = () => {
  const setter = useSetRecoilState(window)

  return (newState: WindowState) => {
    const newTab = {
      id: nanoid(),
      state: [newState],
    }

    setter((curr) => ({
      tabs: [...curr.tabs, newTab],
      selectedTabId: newTab.id,
    }))

    return newTab.id
  }
}

export const useSetTabState = () => {
  const setter = useSetRecoilState(window)

  return (nextState: WindowState, id: string) => {
    setter((curr) => ({
      selectedTabId: id,
      tabs: curr.tabs.map((tab) => {
        if (tab.id === id) {
          return {
            ...tab,
            state: [nextState],
          }
        }

        return tab
      }),
    }))
  }
}

export const useRemoveTab = () => {
  const setter = useSetRecoilState(window)

  return (id: string) => {
    setter((curr) => ({
      ...curr,
      tabs: curr.tabs.filter((tab) => tab.id !== id),
    }))
  }
}
