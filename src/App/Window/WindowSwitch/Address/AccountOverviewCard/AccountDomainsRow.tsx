import React, { Suspense } from "React";
import { useRecoilValue } from "Recoil";
import ExplorerGridRow from "../_sharedComponents/ExplorerGridRow";
import ExplorerLink from "../_sharedComponents/ExplorerLink/ExplorerLink";
import accountDomainsAtom from "./_atoms/accountDomainsAtom";



const AccountDomainsRowContent: React.FC<{}> = () => {
  const accountDomains = useRecoilValue(accountDomainsAtom);

  if (accountDomains.length < 1) {
    return null;
  }

  return (<ExplorerGridRow
    label='Domains'
    value={<>
      {accountDomains.map((domain,i ) => (
        <div key={i}>
          <ExplorerLink type="address" to={domain.address.toBase58()} label={domain.name}/>
        </div>
      ))}
    </>}
  />);
}

function AccountDomainsRow(){
  return <Suspense fallback={null}>
    <AccountDomainsRowContent />
  </Suspense>
};

export default AccountDomainsRow;