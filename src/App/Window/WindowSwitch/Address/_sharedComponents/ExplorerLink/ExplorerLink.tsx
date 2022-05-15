import React from 'react';
import ellipsisify from '../../../../../_helpers/ellipsisify';
import encodeWindowHash from '../../../../../_helpers/encodeWindowHash';
import Link from '../../../_sharedComponents/Link';
import safePubkeyString from '../../_helpers/safePubkeyString';
import ExplorerLinkProps from '../_types/ExplorerLinkProps';
import CopyButton from './CopyButton';

function ExplorerLink({
  to,
  label,
  allowCopy,
  ellipsis,
  type,
}: ExplorerLinkProps) {
  const toString = safePubkeyString(to);
  const fullLabel = label ?? toString;
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

  const href = type ? encodeWindowHash({ type, state: toString }) : '#';
  return (
    <>
      {allowCopy && <CopyButton value={toString} />}
      <Link href={href} title={toString}>
        <pre style={{ display: 'inline' }}>{display}</pre>
        {isShortened && <sub>{` ${fullLabel.length}`}</sub>}
      </Link>
    </>
  );
}

export default ExplorerLink;
