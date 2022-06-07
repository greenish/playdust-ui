import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import React, { useMemo } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import activeTabAtom from '../_atoms/activeTabAtom';
import activeWindowAtom from '../_atoms/activeWindowAtom';
import useSetAppWindowState from '../_hooks/useSetAppWindowState';
import SuspenseBoundary from '../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import WindowInput from './WindowInput/WindowInput';
import WindowStateProvider from './WindowStateProvider/WindowStateProvider';
import WindowSwitch from './WindowSwitch/WindowSwitch';
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
  z-index: 2;
`;

const ContentContainer = styled.div`
  overflow: auto;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

function Window() {
  const activeWindow = useRecoilValue(activeWindowAtom);
  const activeTab = useRecoilValue(activeTabAtom);
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

  if (!activeWindow) {
    return null;
  }

  return (
    <RecoilRoot key={`${activeWindow.tabId}`}>
      <WindowStateProvider
        setWindowImages={setWindowImages}
        windowState={activeWindow}
      >
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
      </WindowStateProvider>
    </RecoilRoot>
  );
}

export default Window;
