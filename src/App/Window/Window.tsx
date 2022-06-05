import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import React, { useMemo } from 'react';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import activeTabAtom from '../_atoms/activeTabAtom';
import activeWindowAtom from '../_atoms/activeWindowAtom';
import connectedWalletAtom from '../_atoms/connectedWalletAtom';
import useSetAppWindowState from '../_hooks/useSetAppWindowState';
import Notifications from '../_sharedComponents/Notifications';
import SuspenseBoundary from '../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import WindowInput from './WindowInput/WindowInput';
import WindowStateProvider from './WindowStateProvider';
import WindowSwitch from './WindowSwitch/WindowSwitch';
import appProfileAtom from './_atoms/appProfileAtom';
import windowStateAvailableAtom from './_atoms/windowStateAvailableAtom';
import ProfileStorageType from './_types/ProfileStorageType';
import WindowSetImagesType from './_types/WindowSetImagesType';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;

const SearchInputContainer = styled.div`
  padding: 16px;
  position: sticky;
  width: 100%;
`;

const ContentContainer = styled.div`
  overflow: auto;
  height: 100%;
  width: 100%;
`;

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const WindowContentRenderer = React.memo(() => {
  const windowStateAvailable = useRecoilValue(windowStateAvailableAtom);
  if (!windowStateAvailable) {
    return null;
  }
  return (
    <RootContainer>
      <SearchInputContainer>
        <SuspenseBoundary
          loading={null}
          error={null}
          content={<WindowInput />}
        />
      </SearchInputContainer>
      <ContentContainer>
        <SuspenseBoundary
          loading={
            <SpinnerContainer>
              <CircularProgress />
            </SpinnerContainer>
          }
          error={null}
          content={<WindowSwitch />}
        />
      </ContentContainer>
    </RootContainer>
  );
});

function Window() {
  const activeWindow = useRecoilValue(activeWindowAtom);
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const activeTab = useRecoilValue(activeTabAtom);
  const [appProfile, setAppProfile] = useRecoilState(appProfileAtom);
  const setAppWindowState = useSetAppWindowState();
  const activeImages = (
    activeTab.windows[activeTab.selectedWindowIdx]?.images ?? []
  ).join(',');

  const setWindowImages = useMemo<WindowSetImagesType>(
    () => (images: string[]) => {
      const nextImages = images.join(',');
      const shouldUpdate = activeImages !== nextImages;

      if (shouldUpdate) {
        if (images.length === 0) {
          setAppWindowState({ images: undefined }, activeWindow.tabId);
        } else {
          setAppWindowState({ images }, activeWindow.tabId);
        }
      }
    },
    [activeImages, activeWindow.tabId, setAppWindowState]
  );

  const profileState = useMemo<ProfileStorageType>(
    () => ({ value: appProfile, setValue: setAppProfile }),
    [appProfile, setAppProfile]
  );

  if (!activeWindow) {
    return null;
  }
  return (
    <RecoilRoot key={`${activeWindow.tabId}`}>
      <WindowStateProvider
        profileState={profileState}
        setWindowImages={setWindowImages}
        windowState={activeWindow}
        connectedWallet={connectedWallet}
      />
      <WindowContentRenderer />
      <Notifications />
    </RecoilRoot>
  );
}

export default Window;
