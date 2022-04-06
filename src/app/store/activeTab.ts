import { selector } from 'recoil'
import * as store from '.'
import type { Tab } from './windowManager'

export const activeTab = selector<Tab | undefined>({
  key: 'activeTab',
  get: ({ get }) => {
    const { tabs, selectedTabId } = get(store.window)

    return tabs?.find((tab) => tab.id === selectedTabId)
  },
})
