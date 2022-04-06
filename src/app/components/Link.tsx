import NextLink, { LinkProps } from 'next/link'
import { PropsWithChildren } from 'react'

const Link = (props: PropsWithChildren<LinkProps>) => (
  <NextLink {...props}>
    <a>{props.children}</a>
  </NextLink>
)

export default Link
