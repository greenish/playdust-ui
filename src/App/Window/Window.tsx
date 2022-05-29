import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import React, { useMemo } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import activeWindowAtom from '../_atoms/activeWindowAtom';
import useSetCurrentWindowState from '../_hooks/useSetCurrentWindowState';
import SuspenseBoundary from '../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import WindowInput from './WindowInput/WindowInput';
import WindowStateProvider from './WindowStateProvider/WindowStateProvider';
import WindowSwitch from './WindowSwitch/WindowSwitch';
import WindowContextType from './_types/WindowContextType';

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
  const activeWindow = useRecoilValue(activeWindowAtom);
  const setCurrentWindowState = useSetCurrentWindowState();

  const windowContext = useMemo<WindowContextType>(
    () => ({
      setWindowImages: (images: string[]) => {
        const activeImages = (activeWindow.images || []).join(',');
        const nextImages = images.join(',');
        const shouldUpdate = activeImages !== nextImages;

        if (shouldUpdate) {
          setCurrentWindowState({
            ...activeWindow,
            images,
          });
        }
      },
    }),
    [activeWindow, setCurrentWindowState]
  );

  if (!activeWindow) {
    return null;
  }

  return (
    <RecoilRoot key={`${activeWindow.tabId}`}>
      <WindowStateProvider context={windowContext}>
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
