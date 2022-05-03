function compact(array?: any[]) {
  let resIndex = 0
  const result: any[] = []

  if (!array) {
    return result
  }

  for (const value of array) {
    if (value) {
      result[resIndex++] = value
    }
  }
  return result
}

export default compact
