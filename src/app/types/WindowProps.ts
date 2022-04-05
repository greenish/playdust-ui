import { WindowState } from '../store'
import type WindowUnion from './WindowUnion'

interface WindowProps {
  key: string
  state: string
  addTab: (state: WindowState) => void
  removeTab: () => void
  type: WindowUnion
}

export default WindowProps
