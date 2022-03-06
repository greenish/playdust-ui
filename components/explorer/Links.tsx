import Link from 'next/link'
import { ellipsisify } from '../../helpers/utils'
import { CopyButton } from './CopyButton'

export interface ExplorerLinkProps {
  url?: string
  to: string | number
  label?: string
  allowCopy?: boolean
  noLink?: boolean
  ellipsis?: any
}

export function ExplorerLink({
  url,
  to,
  label,
  noLink,
  allowCopy,
  ellipsis,
}: ExplorerLinkProps) {
  const display =
    label || (ellipsis ? ellipsisify('' + to, ellipsis[0], ellipsis[1]) : to)

  const content = noLink ? (
    <span>{display}</span>
  ) : (
    <Link href={`${url}/${to}`}>
      <a>{display}</a>
    </Link>
  )

  return (
    <>
      {allowCopy && <CopyButton value={to} />}
      {content}
    </>
  )
}

export function AccountLink(props: ExplorerLinkProps) {
  return <ExplorerLink url="/account" {...props} />
}

export function SlotLink(props: ExplorerLinkProps) {
  return <ExplorerLink url="/block" {...props} />
}

export function ProgramLink(props: ExplorerLinkProps) {
  return <ExplorerLink url="/program" {...props} />
}

export function TxLink(props: ExplorerLinkProps) {
  return <ExplorerLink url="/tx" {...props} />
}
