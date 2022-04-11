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
        state: windowValue,
      },
      tab,
    }
  }

  return {
    windowState: {
      type: 'home',
      state: '',
    },
    tab,
  }
}

export const encodeWindowHash = (
  input: WindowState,
  tabOverride?: string
): string => {
  const decoded = decodeWindowHash()
  const tab = tabOverride || decoded.tab

  if (input.state === '') {
    return ''
  }

  const base = `#${input.type}=${encodeURIComponent(input.state)}`

  if (!tab) {
    return base
  }

  return `${base}&tab=${tab}`
}
