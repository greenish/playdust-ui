import React from 'react';
import ellipsisify from '../../../../../../_helpers/ellipsisify';
import encodeWindowHash from '../../../../../../_helpers/encodeWindowHash';
import Link from '../../../../_sharedComponents/Link';
import CopyButton from './CopyButton';
import ExplorerLinkProps from './_types/ExplorerLinkProps';

function ExplorerLink({
  to,
  label,
  allowCopy,
  ellipsis,
  type,
}: ExplorerLinkProps) {
  const display =
    label ||
    (ellipsis
      ? ellipsisify(
          String(to),
          ellipsis.cutoff,
          ellipsis.remain,
          ellipsis.ellipsis
        )
      : to);

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
