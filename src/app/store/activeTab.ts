import { selector } from 'recoil'
import * as store from '.'
import type { Tab, Window } from '../types/App'

export const activeTab = selector<Tab>({
  key: 'activeTab',
  get: ({ get }) => {
    const { tabs, selectedTabId } = get(store.appState)
    const found = tabs?.find((tab) => tab.id === selectedTabId)

    return found || tabs[0]
  },
})

export const activeWindow = selector<Window>({
  key: 'activeWindow',
  get: ({ get }) => {
    const active = get(activeTab)
    const result = active.windows[active.selectedWindowIdx]

    return result
  },
})
