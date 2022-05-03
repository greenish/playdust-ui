import { selector } from 'recoil'
import activeTab from './activeTab'
import type { WindowType } from './appState'

const activeWindow = selector<WindowType>({
  key: 'activeWindow',
  get: ({ get }) => {
    const active = get(activeTab)
    const result = active.windows[active.selectedWindowIdx]

    return result
  },
})

export default activeWindow
