import styled from '@emotion/styled';
import React, { useEffect, useMemo } from 'react';
import { RecoilRoot, useRecoilSnapshot, useRecoilState, useRecoilValue } from 'recoil';
import activeTabAtom from '../_atoms/activeTabAtom';
import activeWindowAtom from '../_atoms/activeWindowAtom';
import connectedWalletAtom from '../_atoms/connectedWalletAtom';
import useSetAppWindowState from '../_hooks/useSetAppWindowState';
import Notifications from '../_sharedComponents/Notifications/Notifications';
import WhitelistGuarded from '../_sharedComponents/WhitelistGuarded';
import JoinTheWhitelist from './JoinTheWhitelist/JoinTheWhitelist';
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

const WindowContentRenderer = React.memo(() => {
  const windowStateAvailable = useRecoilValue(windowStateAvailableAtom);
  if (!windowStateAvailable) {
    return null;
  }
  return (
    <RootContainer>
      <WhitelistGuarded fallback={<JoinTheWhitelist />}>
        <WindowSwitch />
      </WhitelistGuarded>
    </RootContainer>
  );
});

WindowContentRenderer.whyDidYouRender = true;

function DebugObserver(): React.Node {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({isModified: true})) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}

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
      <DebugObserver />
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

Window.whyDidYouRender = true;

export default Window;
