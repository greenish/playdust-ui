import { selector } from 'recoil'
import * as store from '.'
import type { Tab } from '../types/App'

export const activeTab = selector<Tab | undefined>({
  key: 'activeTab',
  get: ({ get }) => {
    const { tabs, selectedTabId } = get(store.appState)

    return tabs?.find((tab) => tab.id === selectedTabId)
  },
})
