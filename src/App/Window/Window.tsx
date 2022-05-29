import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import React, { useMemo } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import activeTabAtom from '../_atoms/activeTabAtom';
import activeWindowAtom from '../_atoms/activeWindowAtom';
import useSetCurrentWindowState from '../_hooks/useSetCurrentWindowState';
import SuspenseBoundary from '../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import WindowContext from './_sharedComponents/WindowContext';
import WindowInput from './WindowInput/WindowInput';
import WindowContextType from './_types/WindowContextType';
import WindowStateProvider from './WindowStateProvider';
import WindowSwitch from './WindowSwitch/WindowSwitch';

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

function Window() {
  const activeTab = useRecoilValue(activeTabAtom);
  const activeWindow = useRecoilValue(activeWindowAtom);
  const setCurrentWindowState = useSetCurrentWindowState();

  const windowContextValue = useMemo<WindowContextType>(
    () => ({
      setWindowImages: (images: string[]) => {
        const activeImages = (activeWindow.images || []).join(',');
        const nextImages = images.join(',');
        const shouldUpdate = activeImages !== nextImages;

        if (shouldUpdate) {
          setCurrentWindowState(
            {
              ...activeWindow,
              images,
            },
            activeTab.id
          );
        }
      },
    }),
    [activeTab.id, activeWindow, setCurrentWindowState]
  );

  if (!activeTab || !activeWindow) {
    return null;
  }

  return (
    <RecoilRoot key={`${activeTab.id}`}>
      <WindowStateProvider />
      <WindowContext.Provider value={windowContextValue}>
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
      </WindowContext.Provider>
    </RecoilRoot>
  );
}

export default Window;
