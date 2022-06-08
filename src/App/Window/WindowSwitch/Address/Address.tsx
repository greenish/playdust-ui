import { Button } from '@mui/material';
import React from 'react';
import SuspenseBoundary from '../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import useProfileState from '../../_hooks/useProfileState';
import AccountOverviewCard from './AccountOverviewCard/AccountOverviewCard';
import BPFUpgradeableLoaderAccountBuffer from './BPFUpgradeableLoaderAccountBuffer';
import BPFUpgradeableLoaderAccountProgram from './BPFUpgradeableLoaderAccountProgram/BPFUpgradeableLoaderAccountProgram';
import BPFUpgradeableLoaderAccountProgramData from './BPFUpgradeableLoaderAccountProgramData';
import ConfigAccountStakeConfigCard from './ConfigAccountStakeConfigCard';
import ConfigAccountValidatorInfoCard from './ConfigAccountValidatorInfoCard';
import NonceAccountCard from './NonceAccountCard/NonceAccountCard';
import RawAccountData from './RawAccountData';
import SPLTokenAccount from './SPLTokenAccount';
import SPLTokenMint from './SPLTokenMint';
import SPLTokenMintFungible from './SPLTokenMintFungible/SPLTokenMintFungible';
import SPLTokenMintNonFungible from './SPLTokenMintNonFungible/SPLTokenMintNonFungible';
import SPLTokenMultisig from './SPLTokenMultisig';
import StakeAccount from './StakeAccount/StakeAccount';
import SysvarAccountSlotHashesCard from './SysvarAccountSlotHashesCard';
import SysvarAccountStakeHistoryCard from './SysvarAccountStakeHistoryCard';
import TokenAccounts from './TokenAccounts/TokenAccounts';
import Transactions from './Transactions/Transactions';
import VoteAccountCard from './VoteAccountCard/VoteAccountCard';
import WalletGallery from './WalletGallery/WalletGallery';
import ContentContainer from '../_sharedComponents/ContentContainer';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';

function Address() {
  const [profile, setProfile] = useProfileState();

  const testProfileSetting = () => {
    setProfile({
      name: 'test',
      email: `tested${Math.random()}`,
    });
  };

  return (
    <>
      <Button onClick={testProfileSetting}>{`profile: ${JSON.stringify(
        profile
      )}`}</Button>
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
      <ContentContainer>
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
          content={<StakeAccount />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<BPFUpgradeableLoaderAccountBuffer />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<BPFUpgradeableLoaderAccountProgram />}
          error={null}
          loading={null}
        />
        <SuspenseBoundary
          content={<BPFUpgradeableLoaderAccountProgramData />}
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
        <SuspenseBoundary
          content={<VoteAccountCard />}
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
