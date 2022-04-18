import type { App, Tab, Window } from '../types/App'
import { isInWindowUnion } from '../types/WindowUnion'

const validateWindows = (windows: Window[]) => {
  windows.map((window) => {
    if (typeof window.state !== 'string') {
      throw new Error('window state is not a string')
    }

    if (!isInWindowUnion(window.type)) {
      throw new Error('invalid window type')
    }
  })
}

const validateTabs = (tabs: Tab[]) => {
  if (!Array.isArray(tabs)) {
    throw new Error('window tabs is not an array')
  }

  tabs.map((tab) => {
    if (typeof tab.id !== 'string') {
      throw new Error('tab id is not an array')
    }

    validateWindows(tab.windows)
  })
}

const validateSelectedTabId = (input: any) => {
  if (input === undefined || typeof input === 'string') {
    return
  }

  throw new Error('invalid selected tab id')
}

const validateAppState = (input: string): boolean => {
  try {
    const { selectedTabId, tabs } = JSON.parse(input) as App

    validateSelectedTabId(selectedTabId)
    validateTabs(tabs)

    return true
  } catch (e) {
    console.error('Unable to validate window state:', e)
    return false
  }
}

export default validateAppState
