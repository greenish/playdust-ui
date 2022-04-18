import type WindowUnion from './WindowUnion'

export interface Window {
  state: string
  type: WindowUnion
}

export interface Tab {
  id: string
  windows: Window[]
}

export interface App {
  tabs: Tab[]
  selectedTabId: string | undefined
}
