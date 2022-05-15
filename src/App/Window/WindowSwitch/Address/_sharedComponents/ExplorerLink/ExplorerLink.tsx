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
  const shortLabel = ellipsis
    ? ellipsisify(
        fullLabel,
        ellipsis.cutoff,
        ellipsis.remain,
        ellipsis.ellipsis
      )
    : fullLabel;

  const isShortened = fullLabel.length > shortLabel.length;
  const display = isShortened ? shortLabel : fullLabel;

  const href = type ? encodeWindowHash({ type, state: String(to) }) : '#';
  return (
    <>
      {allowCopy && <CopyButton value={to} />}
      <Link href={href} title={String(to)}>
        <pre style={{ display: 'inline' }}>{display}</pre>
        {isShortened && <sub>{` ${fullLabel.length}`}</sub>}
      </Link>
    </>
  );
}

export default ExplorerLink;
