import React, { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import ExplorerGridRow from '../_sharedComponents/ExplorerGridRow';
import ExplorerLink from '../_sharedComponents/ExplorerLink/ExplorerLink';
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
    <Suspense fallback={null}>
      <AccountDomainsRowContent />
    </Suspense>
  );
}

export default AccountDomainsRow;
