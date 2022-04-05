const ALL_WINDOWS = [
  'account',
  'block',
  'home',
  'search',
  'tx',
  'epoch',
] as const
type WindowTuple = typeof ALL_WINDOWS
type WindowUnion = WindowTuple[number]

export const isInWindowUnion = (value: string): value is WindowUnion => {
  return ALL_WINDOWS.includes(value as WindowUnion)
}

export default WindowUnion
