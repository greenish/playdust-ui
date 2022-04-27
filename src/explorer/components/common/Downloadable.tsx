import { PropsWithChildren } from 'react'

interface DownloadableProps {
  data: any
  filename: string
}

export const Downloadable = ({
  children,
}: PropsWithChildren<DownloadableProps>) => {
  return <>{children}</>
}
