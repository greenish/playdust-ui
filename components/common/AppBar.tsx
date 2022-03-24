import styled from '@emotion/styled'
import { Home } from '@mui/icons-material'
import { createTheme, IconButton, Paper, ThemeProvider } from '@mui/material'
import Link from 'next/link'
import { ReactNode } from 'react'
import Notifications from './Notifications'
import WalletButton from './WalletButton'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const appBarWidth = 64

const VerticalAppBar = styled(Paper)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${appBarWidth}px;
`

const VerticalAppBarContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 16px 8px;
`

const ChildrenContainer = styled.div`
  position: absolute;
  top: 8px;
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

interface AppBarProps {
  children: ReactNode
}

const AppBar = ({ children }: AppBarProps) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <VerticalAppBar square elevation={3}>
          <VerticalAppBarContent>
            <div>
              <Link href="/">
                <a>
                  <IconButton>
                    <Home />
                  </IconButton>
                </a>
              </Link>
            </div>
            <WalletButton />
          </VerticalAppBarContent>
        </VerticalAppBar>
      </ThemeProvider>
      <ChildrenContainer>
        <ChildrenRelativeContainer>{children}</ChildrenRelativeContainer>
      </ChildrenContainer>
      <Notifications />
    </>
  )
}

export default AppBar
