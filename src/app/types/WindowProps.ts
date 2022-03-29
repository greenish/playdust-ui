interface WindowProps {
  state: string
  setState: (update: string) => void
  addTab: (state: string) => void
}

export default WindowProps
