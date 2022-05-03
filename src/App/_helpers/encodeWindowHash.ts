import { nanoid } from 'nanoid'
import type { WindowType } from '../_atoms/appState'
import decodeWindowHash from './decodeWindowHash'

export interface EncodeHashOptionsType {
  tabOverride?: string
  newTab?: boolean
}

const getTabId = (options?: EncodeHashOptionsType) => {
  const { tabOverride, newTab } = options || {}

  if (tabOverride) {
    return tabOverride
  }

  if (newTab) {
    return nanoid()
  }

  return decodeWindowHash().tab
}

const encodeWindowHash = (
  input: WindowType,
  options?: EncodeHashOptionsType
): string => {
  const tab = getTabId(options)

  if (input.type === 'home') {
    return `/#tab=${tab}`
  }

  const base = `/#${input.type}=${encodeURIComponent(input.state)}`

  if (!tab) {
    return base
  }

  return `${base}&tab=${tab}`
}

export default encodeWindowHash
