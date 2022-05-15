import React from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerGridRow from '../_sharedComponents/ExplorerGridRow';
import ExplorerLink from '../../_sharedComponents/ExplorerLink/ExplorerLink';
import SuspenseBoundary from '../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import accountDomainsAtom from './_atoms/accountDomainsAtom';

function AccountDomainsRowContent() {
  const accountDomains = useRecoilValue(accountDomainsAtom);

  if (accountDomains.length < 1) {
    return null;
  }

  return (
    <ExplorerGridRow
      label="Domains"
      value={
        <>
          {accountDomains.map((domain) => (
            <div key={domain.name}>
              <ExplorerLink
                type="address"
                to={domain.address.toBase58()}
                label={domain.name}
              />
            </div>
          ))}
        </>
      }
    />
  );
}

function AccountDomainsRow() {
  return (
    <SuspenseBoundary loading={null} error={null}>
      <AccountDomainsRowContent />
    </SuspenseBoundary>
  );
}

export default AccountDomainsRow;
