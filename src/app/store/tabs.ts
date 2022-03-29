import { nanoid } from 'nanoid'
import { atom, useSetRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

interface Tab {
  id: string
  state: string[]
  selected: boolean
}

export const tabs = atom<Tab[]>({
  key: 'tabs',
  default: [],
  effects: [persistAtom],
})

export const useSetSelectedTab = () => {
  const setter = useSetRecoilState(tabs)

  return (id?: string) =>
    setter((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        selected: tab.id === id,
      }))
    )
}

export const useAddTab = () => {
  const setter = useSetRecoilState(tabs)

  return (state = '') => {
    const id = nanoid()

    setter((tabs) => [
      ...tabs,
      {
        id,
        state: [state],
        selected: true,
      },
    ])
  }
}

export const useSetTabState = () => {
  const setter = useSetRecoilState(tabs)

  return (nextState: string, id: string) => {
    setter((tabs) =>
      tabs.map((tab) => {
        if (tab.id === id) {
          return {
            ...tab,
            state: [nextState],
          }
        }

        return tab
      })
    )
  }
}

export const useRemoveTab = () => {
  const setter = useSetRecoilState(tabs)

  return (id: string) => setter((tabs) => tabs.filter((tab) => tab.id !== id))
}
