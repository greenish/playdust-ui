import styled from '@emotion/styled';
import { Add, Close, DeleteSweep, Home, Search } from '@mui/icons-material';
import { IconButton, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import activeTabAtom from '../_atoms/activeTabAtom';
import appStateAtom from '../_atoms/appStateAtom';
import currentUserProfileAtom from '../_atoms/currentUserProfileAtom';
import appBarWidth from '../_helpers/appBarWidth';
import safePromise from '../_helpers/safePromise';
import useGoHome from '../_hooks/useGoHome';
import ImageButton from '../_sharedComponents/ImageButton';
import WhitelistGuarded from '../_sharedComponents/WhitelistGuarded';
import AppWindowType from '../_types/AppWindowType';
import Playdust from './PlaydustIcon';
import WalletButton from './WalletButton/WalletButton';
import useGoToNewTab from './_hooks/useGoToNewTab';
import useGoToTab from './_hooks/useGoToTab';
import useRemoveTab from './_hooks/useRemoveTab';

const largeButtonSize = 40;
const smallButtonSize = 24;
const imageAnimationLength = 2;

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 4px 0px 16px 0px;
  width: ${appBarWidth}px;
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const TabButtonContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  width: 100%;
  z-index: 2;
`;

const ActiveHighlight = styled.div`
  width: 3px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
`;

const CloseButtonContainer = styled.div`
  position: absolute;
  padding: 8px;
  opacity: 0;
  z-index: 2;
  transition: opacity 0.25s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const getWindowTab = (window: AppWindowType): ReactNode | undefined => {
  switch (window.type) {
    case 'home':
      return <Home />;
    case 'search':
      return <Search />;
    case 'tx':
      return <Typography>T</Typography>;
    case 'block':
      return <Typography>B</Typography>;
    case 'address':
      return <Typography>A</Typography>;
    case 'epoch':
      return <Typography>E</Typography>;
    default:
      return null;
  }
};

function AppBar() {
  const currentUserProfile = useRecoilValue(currentUserProfileAtom);
  const { tabs } = useRecoilValue(appStateAtom);
  const activeTab = useRecoilValue(activeTabAtom);
  const removeTab = useRemoveTab();
  const goToTab = useGoToTab();
  const goToNewTab = useGoToNewTab();
  const router = useRouter();
  const theme = useTheme();
  const goHome = useGoHome();

  if (!router.isReady) {
    return null;
  }

  const inWindowManager = router.pathname === '/';
  const backgroundColor = theme.palette.background.default;

  const tabControls = (
    <WhitelistGuarded fallback={null}>
      {tabs.map((tab) => {
        const isActive = inWindowManager && tab.id === activeTab?.id;
        const currentWindow = tab.windows[tab.selectedWindowIdx];

        return (
          <TabButtonContainer key={tab.id}>
            <div>
              <ImageButton
                size={largeButtonSize}
                images={currentWindow.images}
                onClick={() => goToTab(tab)}
              >
                {getWindowTab(currentWindow)}
              </ImageButton>
              {isActive && (
                <ActiveHighlight
                  style={{
                    height: largeButtonSize,
                    backgroundColor,
                  }}
                />
              )}
            </div>
            {isActive && (
              <CloseButtonContainer>
                <ImageButton size={smallButtonSize} onClick={() => removeTab()}>
                  <Close fontSize="small" />
                </ImageButton>
              </CloseButtonContainer>
            )}
          </TabButtonContainer>
        );
      })}
      <TabButtonContainer>
        <ImageButton onClick={() => goToNewTab()}>
          <Add />
        </ImageButton>
        {inWindowManager && tabs.length > 0 && (
          <ImageButton
            size={24}
            onClick={() => {
              localStorage.clear();
              safePromise(router.replace('/'));
              router.reload();
            }}
          >
            <DeleteSweep fontSize="small" />
          </ImageButton>
        )}
      </TabButtonContainer>
    </WhitelistGuarded>
  );

  return (
    <RootContainer>
      <TopContainer>
        <IconButton onClick={() => goHome()}>
          <Playdust width={largeButtonSize} />
        </IconButton>
        {tabControls}
      </TopContainer>
      <WalletButton backgroundColor={backgroundColor} size={largeButtonSize} />
    </RootContainer>
  );
}

export default AppBar;
