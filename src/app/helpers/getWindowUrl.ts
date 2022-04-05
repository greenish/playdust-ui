import { WindowState } from '../store'
import { isInWindowUnion } from '../types/WindowUnion'

export const decodeWindowSearch = (input?: string): WindowState => {
  const search = (input || window.location.search).slice(1)
  const decoded = decodeURIComponent(search)
  const [windowType, windowValue] = decoded.split('=')

  if (isInWindowUnion(windowType)) {
    return {
      type: windowType,
      value: windowValue,
    }
  }

  return {
    type: 'home',
    value: '',
  }
}

export const encodeWindowSearch = (input: WindowState): string =>
  `?${input.type}=${encodeURIComponent(input.value)}`
