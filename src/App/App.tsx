import styled from '@emotion/styled'
import { createTheme, Paper, ThemeProvider } from '@mui/material'
import { useRouter } from 'next/router'
import AppBar, { appBarWidth } from './AppBar'
import Notifications from './Notifications'
import Provider from './Provider/Provider'
import Window from './Window/Window'

const appBarTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const AppBarContainer = styled(Paper)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
`

const ChildrenContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${appBarWidth}px;
  bottom: 0;
  right: 0;
  overflow: hidden;
`

const ChildrenRelativeContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: auto;
`

const App = () => {
  const router = useRouter()

  if (!router.isReady) {
    return <></>
  }

  return (
    <Provider>
      <ThemeProvider theme={appBarTheme}>
        <AppBarContainer square elevation={3}>
          <AppBar />
        </AppBarContainer>
      </ThemeProvider>
      <ChildrenContainer>
        <ChildrenRelativeContainer>
          <Window />
        </ChildrenRelativeContainer>
      </ChildrenContainer>
      <Notifications />
    </Provider>
  )
}

export default App
