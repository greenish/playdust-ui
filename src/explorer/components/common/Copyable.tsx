import { PropsWithChildren } from 'react'

type CopyableProps = PropsWithChildren<{ text: string }>

export function Copyable({ text, children }: CopyableProps) {
  return <>{children}</>
}
