import { getRecoil } from 'recoil-nexus'
import * as store from '../store'
import { WindowState } from '../store'
import { isInWindowUnion } from '../types/WindowUnion'

export const decodeWindowHash = (
  input?: string
): { windowState: WindowState; tab: string } => {
  const hash = (input || window.location.hash).slice(1)
  const decoded = decodeURIComponent(hash)
  const pairs = decoded.split('&').map((entry) => entry.split('='))
  const tab = pairs.find(([key]) => key === 'tab')?.[1] || '0'
  const [windowType, windowValue] = pairs.find(([key]) =>
    isInWindowUnion(key)
  ) || ['', '']

  if (isInWindowUnion(windowType)) {
    return {
      windowState: {
        type: windowType,
        value: windowValue,
      },
      tab,
    }
  }

  return {
    windowState: {
      type: 'home',
      value: '',
    },
    tab,
  }
}

export const encodeWindowHash = (input: WindowState, tab?: string): string => {
  const { selectedTabId } = getRecoil(store.window)
  const normalizedTab = tab || selectedTabId

  const base = `#${input.type}=${encodeURIComponent(input.value)}`

  if (!normalizedTab) {
    return base
  }

  return `${base}&tab=${normalizedTab}`
}
