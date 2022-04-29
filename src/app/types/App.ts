import type WindowUnion from './WindowUnion'

export interface Window {
  state: string
  type: WindowUnion
  images?: string[]
}

export interface Tab {
  id: string
  windows: Window[]
  selectedWindowIdx: number
}

export interface App {
  tabs: Tab[]
  selectedTabId: string
}
