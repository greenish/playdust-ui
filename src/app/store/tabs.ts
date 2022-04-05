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
  selected: boolean
}

export const tabs = atom<Tab[]>({
  key: 'tabs',
  default: [],
  effects: [persistAtom],
})

export const useSetSelectedTab = () => {
  const setter = useSetRecoilState(tabs)

  return (id?: string) => {
    setter((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        selected: tab.id === id,
      }))
    )
  }
}

export const useAddTab = () => {
  const setter = useSetRecoilState(tabs)

  return (newState: WindowState) => {
    const newTab = {
      id: nanoid(),
      state: [newState],
      selected: true,
    }

    setter((tabs) => [
      ...tabs.map((tab) => ({ ...tab, selected: false })),
      newTab,
    ])
  }
}

export const useSetTabState = () => {
  const setter = useSetRecoilState(tabs)

  return (nextState: WindowState, id: string) => {
    setter((tabs) =>
      tabs.map((tab) => {
        if (tab.id === id) {
          return {
            ...tab,
            state: [nextState],
            selected: true,
          }
        }

        return {
          ...tab,
          selected: false,
        }
      })
    )
  }
}

export const useRemoveTab = () => {
  const setter = useSetRecoilState(tabs)

  return (id: string) => {
    setter((tabs) => tabs.filter((tab) => tab.id !== id))
  }
}
