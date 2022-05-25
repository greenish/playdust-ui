import styled from '@emotion/styled';
import { Paper, styled as muiStyled } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import AppBar from './AppBar/AppBar';
import Notifications from './Notifications/Notifications';
import Provider from './Provider/Provider';
import Window from './Window/Window';
import appBarWidth from './_helpers/appBarWidth';
import SuspenseBoundary from './_sharedComponents/SuspenseBoundary/SuspenseBoundary';

const AppBarContainer = muiStyled(Paper)(
  ({ theme }) => `
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: ${theme.palette.text.primary};
`
);

const ChildrenContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${appBarWidth}px;
  bottom: 0;
  right: 0;
  overflow: hidden;
`;

const ChildrenRelativeContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: auto;
`;

function App() {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  return (
    <Provider>
      <AppBarContainer>
        <SuspenseBoundary loading={null} error={null} content={<AppBar />} />
      </AppBarContainer>
      <ChildrenContainer>
        <ChildrenRelativeContainer>
          <SuspenseBoundary loading={null} error={null} content={<Window />} />
        </ChildrenRelativeContainer>
      </ChildrenContainer>
      <Notifications />
    </Provider>
  );
}

export default App;
