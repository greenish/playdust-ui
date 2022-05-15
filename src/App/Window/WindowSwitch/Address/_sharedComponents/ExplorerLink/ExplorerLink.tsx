import React from 'react';
import ellipsisify from '../../../../../_helpers/ellipsisify';
import encodeWindowHash from '../../../../../_helpers/encodeWindowHash';
import Link from '../../../_sharedComponents/Link';
import CopyButton from './CopyButton';
import ExplorerLinkProps from './_types/ExplorerLinkProps';

function ExplorerLink({
  to,
  label,
  allowCopy,
  ellipsis,
  type,
}: ExplorerLinkProps) {
  const fullLabel = label || String(to);
  const display = ellipsis
    ? ellipsisify(
        fullLabel,
        ellipsis.cutoff,
        ellipsis.remain,
        ellipsis.ellipsis
      )
    : fullLabel;

  const href = type ? encodeWindowHash({ type, state: String(to) }) : '#';
  return (
    <>
      {allowCopy && <CopyButton value={to} />}
      <Link href={href} title={fullLabel}>
        <pre style={{ display: 'inline' }}>{display}</pre>
      </Link>
    </>
  );
}

export default ExplorerLink;
