import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useRecoilValue } from 'recoil';
import currentUserProfileAtom from '../../_atoms/currentUserProfileAtom';
import SuspenseBoundary from '../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import windowStateAtom from '../_atoms/windowStateAtom';
import Address from './Address/Address';
import Epoch from './Epoch/Epoch';
import Home from './Home/Home';
import JoinTheWhitelist from './JoinTheWhitelist';
import Search from './Search/Search';
import WindowInput from './_sharedComponents/WindowInput/WindowInput';

const SearchInputContainer = styled.div`
  padding: 16px;
  position: sticky;
  width: 100%;
  z-index: 2;
`;

const ContentContainer = styled(Scrollbars)`
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

function StandardWindowContainer({ children }: PropsWithChildren<object>) {
  return (
    <>
      <SearchInputContainer>
        <SuspenseBoundary
          loading={null}
          error={null}
          content={<WindowInput />}
        />
      </SearchInputContainer>
      <ContentContainer autoHide={true}>
        <SuspenseBoundary
          loading={
            <SpinnerContainer>
              <CircularProgress />
            </SpinnerContainer>
          }
          error={null}
          content={children}
        />
      </ContentContainer>
    </>
  );
}

function GuardedHome() {
  const currentUserProfile = useRecoilValue(currentUserProfileAtom);

  if (!currentUserProfile || !currentUserProfile.isWhitelisted) {
    return <JoinTheWhitelist />;
  }

  return <Home />;
}

function WindowSwitch() {
  const windowState = useRecoilValue(windowStateAtom);

  switch (windowState?.type) {
    case 'home':
      return <GuardedHome />;
    case 'search':
      return (
        <StandardWindowContainer>
          <Search />
        </StandardWindowContainer>
      );
    case 'address':
      return (
        <StandardWindowContainer>
          <Address />
        </StandardWindowContainer>
      );
    case 'block':
      return null;
    case 'tx':
      return null;
    case 'epoch':
      return <Epoch />;
    default:
      return null;
  }
}

export default WindowSwitch;
