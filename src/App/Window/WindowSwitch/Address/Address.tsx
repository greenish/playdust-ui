import React from 'react';
import SuspenseBoundary from '../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';
import ConfigAccountStakeConfigCard from './ConfigAccountStakeConfigCard';
import ConfigAccountValidatorInfoCard from './ConfigAccountValidatorInfoCard';
import ContentContainer from './ContentContainer';
import NonceAccountCard from './NonceAccountCard/NonceAccountCard';
import RawAccountData from './RawAccountData';
import SPLTokenAccount from './SPLTokenAccount';
import SPLTokenMint from './SPLTokenMint/SPLTokenMint';
import SPLTokenMintFungible from './SPLTokenMintFungible/SPLTokenMintFungible';
import SPLTokenMintNonFungible from './SPLTokenMintNonFungible/SPLTokenMintNonFungible';
import SPLTokenMultisig from './SPLTokenMultisig';
import StakeAccount from './StakeAccount/StakeAccount';
import SysvarAccountSlotHashesCard from './SysvarAccountSlotHashesCard';
import SysvarAccountStakeHistoryCard from './SysvarAccountStakeHistoryCard';
import TokenAccounts from './TokenAccounts/TokenAccounts';
import Transactions from './Transactions/Transactions';
import WalletGallery from './WalletGallery/WalletGallery';
import ExplorerAccordion from './_sharedComponents/ExplorerAccordion';

function Address() {
  return (
    <>

      {/* Special Account Views */}

      <SuspenseBoundary
        content={<SPLTokenMintNonFungible />}
        error={null}
        loading={null}
      />

      <SuspenseBoundary
        content={<SPLTokenMintFungible />}
        error={null}
        loading={null}
      />

      {/* User Wallet Accounts */}
      <ContentContainer  sx={{ backgroundColor: 'ghostwhite' }}>
        <SuspenseBoundary
          content={<WalletGallery />}
          error={null}
          loading={null}
        />

        <SuspenseBoundary
          content={<TokenAccounts />}
          error={null}
          loading={null}
        />
      </ContentContainer>
      <ContentContainer sx={{ backgroundColor: 'lightgrey', padding: "16px 0px" }}>
        {/* All Accounts */}
        <SuspenseBoundary
          content={<AccountOverviewCard />}
          error={null}
          loading={null}
        />

        {/* Token Accounts */}
        <SuspenseBoundary
          content={<SPLTokenAccount />}
          error={null}
          loading={null}
        />
          <SuspenseBoundary
          content={<SPLTokenMint />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<StakeAccount />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<SPLTokenMultisig />}
          error={null}
          loading={null}
        />


        {/* Config & Sys Accounts */}
        <SuspenseBoundary
          content={<ConfigAccountValidatorInfoCard />}         
          error={null}
          loading={null}          
        />
        <SuspenseBoundary
          content={<ConfigAccountStakeConfigCard />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<NonceAccountCard />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<SysvarAccountSlotHashesCard />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<SysvarAccountStakeHistoryCard />}
          error={null}
          loading={null}
        />

        {/* All Accounts */}
        <SuspenseBoundary
          content={<RawAccountData />}
          error={null}
          loading={null}
        />
        <ExplorerAccordion
          id="transactions"
          title="Transactions"
          content={<Transactions />}
        />
      </ContentContainer>
    </>
  );
}

export default Address;
