import type WindowUnion from './WindowUnion'

interface WindowProps {
  state: string
  clearState: () => void
  type: WindowUnion
}

export default WindowProps
