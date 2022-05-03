function range(from: number, to: number, step: number) {
  return [...Array(Math.floor((to - from) / step) + 1)].map(
    (_, i) => from + i * step
  )
}

export default range
