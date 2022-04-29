import type WindowUnion from './WindowUnion'

interface WindowProps {
  state: string
  clearState: () => void
  setWindowImages: (images: string[]) => void
  type: WindowUnion
}

export default WindowProps
