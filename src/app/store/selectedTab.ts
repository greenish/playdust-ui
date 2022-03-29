import { selector } from 'recoil'
import * as store from '.'

export const selectedTab = selector({
  key: 'selectedTab',
  get: ({ get }) => {
    const tabs = get(store.tabs)
    const result = tabs.find((tab) => tab.selected)

    return result
  },
})
