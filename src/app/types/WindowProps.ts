import type WindowUnion from './WindowUnion'

interface WindowProps {
  state: string
  removeTab: () => void
  type: WindowUnion
}

export default WindowProps
