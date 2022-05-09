import Link from 'next/link';
import React from 'react';
import ellipsisify from '../../../../_helpers/ellipsisify';
import encodeWindowHash from '../../../../_helpers/encodeWindowHash';
import ExplorerLinkProps from '../_types/ExplorerLinkPropsType';
import CopyButton from './CopyButton';

function ExplorerLink({
  to,
  label,
  allowCopy,
  ellipsis,
  type,
}: ExplorerLinkProps) {
  const display =
    label ||
    (ellipsis ? ellipsisify(String(to), ellipsis[0], ellipsis[1]) : to);

  const href = type ? encodeWindowHash({ type, state: String(to) }) : '#';
  return (
    <>
      {allowCopy && <CopyButton value={to} />}
      <Link href={href}>
        <pre style={{ display: 'inline' }}>{display}</pre>
      </Link>
    </>
  );
}

export default ExplorerLink;
