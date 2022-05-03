export const ALL_WINDOWS = [
  'account',
  'block',
  'home',
  'search',
  'tx',
  'epoch',
] as const
type WindowTuple = typeof ALL_WINDOWS
type WindowUnionType = WindowTuple[number]

export const isInWindowUnion = (value: string): value is WindowUnionType => {
  return ALL_WINDOWS.includes(value as WindowUnionType)
}

export default WindowUnionType
