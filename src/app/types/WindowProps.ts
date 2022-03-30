import type { WindowComponentType } from '../helpers/getWindowType'

interface WindowProps {
  state: string
  setState: (update: string) => void
  addTab: (state: string) => void
  removeTab: () => void
  type: WindowComponentType
}

export default WindowProps
