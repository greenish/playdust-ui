import { ellipsisify } from '../../helpers/utils'
import { CopyButton } from './CopyButton'
import { Link } from './Link'

export interface ExplorerLinkProps {
  url?: string
  to: string | number
  label?: string
  allowCopy?: boolean
  ellipsis?: any
}

export function ExplorerLink({
  url,
  to,
  label,
  allowCopy,
  ellipsis,
}: ExplorerLinkProps) {
  const display =
    label || (ellipsis ? ellipsisify('' + to, ellipsis[0], ellipsis[1]) : to)

  return (
    <>
      {allowCopy && <CopyButton value={to} />}
      <Link href={`${url}/${to}`}>
        <a>{display}</a>
      </Link>
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

export function EpochLink(props: ExplorerLinkProps) {
  return <ExplorerLink url="/epoch" {...props} />
}
