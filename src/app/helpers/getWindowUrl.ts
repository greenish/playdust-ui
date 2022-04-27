import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import { Window } from '../types/App'
import { isInWindowUnion } from '../types/WindowUnion'

const getWindowHash = () => {
  if (typeof window === undefined) {
    return ''
  }

  return window.location.hash
}

export const decodeWindowHash = (
  input?: string
): { windowState: Window; tab: string } => {
  const hash = (input || getWindowHash()).slice(1)
  const decoded = decodeURIComponent(hash)
  const pairs = decoded.split('&').map((entry) => entry.split('='))
  const tab = pairs.find(([key]) => key === 'tab')?.[1] || nanoid()
  const [windowType, windowValue] = pairs.find(([key]) =>
    isInWindowUnion(key)
  ) || ['', '']

  if (isInWindowUnion(windowType)) {
    return {
      windowState: {
        type: windowType,
        state: windowValue || '',
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
  input: Window,
  tabOverride?: string,
  clearTab?: boolean
): string => {
  const decoded = decodeWindowHash()
  const tab = tabOverride || decoded.tab

  if (input.type === 'home' && clearTab) {
    return '/'
  }

  if (input.type === 'home') {
    return `/#tab=${tab}`
  }

  const base =
    input.state === ''
      ? `/#${input.type}`
      : `/#${input.type}=${encodeURIComponent(input.state)}`

  if (!tab || clearTab) {
    return base
  }

  return `${base}&tab=${tab}`
}

const makeUseNavWindowHash = (method: 'push' | 'replace') =>
  function useNavWindowHash() {
    const router = useRouter()

    return (input: Window, tabOverride?: string, clearTab?: boolean) => {
      const encoded = encodeWindowHash(input, tabOverride, clearTab)
      const actual = `/${getWindowHash()}`
      const didUrlChange = encoded !== actual

      if (didUrlChange) {
        router[method](encoded)
      }
    }
  }

export const usePushWindowHash = makeUseNavWindowHash('push')
export const useReplaceWindowHash = makeUseNavWindowHash('replace')
