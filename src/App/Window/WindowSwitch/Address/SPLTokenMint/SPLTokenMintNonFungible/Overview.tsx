import React from 'react';
import nftDetailsAtom from './_atoms/nftDetailsAtom';
import { useRecoilValue } from 'recoil';
import ExplorerCard from '../../_sharedComponents/ExplorerCard';
import TableSkeleton from '../../_sharedComponents/TableSkeleton/TableSkeleton';
import ExplorerGridRow from '../../_sharedComponents/ExplorerGridRow';
import ExplorerGrid from '../../_sharedComponents/ExplorerGrid';

function OverviewRows() {

    const nftDetails = useRecoilValue(nftDetailsAtom);
    if (!nftDetails.data.offChainData) {
        return null;
    }

    const details = nftDetails.data;

    /*
      const account = useAccountInfo(pubkey)
      const nftDetails = useNFTDetails(pubkey)
      const editionInfo = useEditionInfo(pubkey)

      const data = account?.data as ParsedAccountData

      const {
          parsed: {
              info: { mintAuthority },
          },
      } = data
    */

  /*
    editionInfo.masterEdition?.maxSupply && <ExplorerGridRow label="Max Total Supply" value={editionInfo.masterEdition.maxSupply.toNumber() === 0
            ? 1
            : editionInfo.masterEdition.maxSupply.toNumber()} />

        <ExplorerGridRow label="Current Supply" value={editionInfo.masterEdition.supply.toNumber() === 0
            ? 1
            : editionInfo.masterEdition.supply.toNumber()} />


    nftDetails?.collection?.verified && <ExplorerGridRow
        label="Verified Collection Address"
        value={<LabeledAddressLink
            to={nftDetails.collection.key}
            allowCopy
        />} />

    mintAuthority &&
        <ExplorerGridRow label="Mint Authority" value={<LabeledAddressLink to={mintAuthority} allowCopy />} />


    nftDetails?.updateAuthority && <ExplorerGridRow label="Update Authority" value={<LabeledAddressLink to={nftDetails.updateAuthority} allowCopy />} />

    nftDetails?.data && <ExplorerGridRow label="Seller Fee" value={`${nftDetails?.data.sellerFeeBasisPoints / 100}%`} />
   */

  return <></>;
}

function Overview() {
    return (
        <ExplorerCard loading={<TableSkeleton />} error={null}>
            <ExplorerGrid>
                <OverviewRows />
            </ExplorerGrid>
        </ExplorerCard>
    );
}

export default Overview;
