import { WindowState } from '../store'
import type WindowUnion from './WindowUnion'

interface WindowProps {
  state: string
  setState: (nextValue: string) => void
  addTab: (state: WindowState) => void
  removeTab: () => void
  type: WindowUnion
}

export default WindowProps
