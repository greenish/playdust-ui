import { selector } from 'recoil'
import * as store from '.'
import type { Tab } from './tabs'

export const activeTab = selector<Tab | undefined>({
  key: 'activeTab',
  get: ({ get }) => {
    const tabs = get(store.tabs)
    const result = tabs.find((tab) => tab.selected)

    return result
  },
})
