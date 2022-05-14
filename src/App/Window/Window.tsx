import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import React, { Suspense, useMemo } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { userProfile } from '../../me/store';
import activeTabAtom from '../_atoms/activeTabAtom';
import WindowInput from './WindowInput/WindowInput';
import WindowSwitch from './WindowSwitch/WindowSwitch';
import activeWindowAtom from './_atoms/activeWindowAtom';
import currentStateString from './_atoms/currentStateStringAtom';
import userProfileString from './_atoms/userProfileStringAtom';
import useRouteApp from './_hooks/useRouteApp';
import useSetCurrentWindowState from './_hooks/useSetCurrentWindowState';
import type WindowProps from './_types/WindowPropsType';

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
  const profile = useRecoilValue(userProfile);

  const windowProps = useMemo<WindowProps>(
    () => ({
      ...activeWindow,
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

  const { didMount } = useRouteApp();

  if (!didMount) {
    return null;
  }

  return (
    <RecoilRoot
      key={`${activeTab.id}:${windowProps.state}`}
      initializeState={({ set }) => {
        set(userProfileString, JSON.stringify(profile));
        set(currentStateString, JSON.stringify(activeWindow));
      }}
    >
      <RootContainer>
        <SearchInputContainer>
          <WindowInput {...windowProps} />
        </SearchInputContainer>
        <ContentContainer>
          <Suspense
            fallback={
              <SpinnerContainer>
                <CircularProgress />
              </SpinnerContainer>
            }
          >
            <WindowSwitch {...windowProps} />
          </Suspense>
        </ContentContainer>
      </RootContainer>
    </RecoilRoot>
  );
}

export default Window;
