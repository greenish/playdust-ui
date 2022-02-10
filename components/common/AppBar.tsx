import styled from '@emotion/styled'
import { Home } from '@mui/icons-material'
import { IconButton, Paper, Toolbar } from '@mui/material'
import Link from 'next/link'
import { ReactNode } from 'react'
import AppBarSearch from './AppBarSearch'
import Notifications from './Notifications'
import WalletButton from './WalletButton'

const appBarHeight = 72
const appBarBottomMargin = 16
const appBarOffset = appBarHeight + appBarBottomMargin

const AppBarContainer = styled(Paper)`
  position: sticky;
  top: 0;
  height: ${appBarHeight}px;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
`

const AppBarPaddingContainer = styled.div`
  position: sticky;
  top: ${appBarHeight}px;
  height: ${appBarBottomMargin}px;
`

const AppBarContent = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const AppBarLeftContent = styled.div`
  display: flex;
  align-items: center;
`

const HomeContainer = styled.div`
  margin-right: 8px;
`

const ChildrenContainer = styled.div`
  position: absolute;
  top: ${appBarOffset}px;
  left: 0;
  bottom: 0;
  right: 0;
`

const ChildrenRelativeContainer = styled.div`
  position: relative;
  height: 100%;
`

interface AppBarProps {
  children: ReactNode
}

const AppBar = ({ children }: AppBarProps) => {
  return (
    <>
      <AppBarContainer elevation={3}>
        <AppBarContent>
          <AppBarLeftContent>
            <HomeContainer>
              <Link href="/">
                <a>
                  <IconButton>
                    <Home />
                  </IconButton>
                </a>
              </Link>
            </HomeContainer>
            <AppBarSearch />
          </AppBarLeftContent>
          <WalletButton />
        </AppBarContent>
      </AppBarContainer>
      <AppBarPaddingContainer />
      <ChildrenContainer>
        <ChildrenRelativeContainer>{children}</ChildrenRelativeContainer>
      </ChildrenContainer>
      <Notifications />
    </>
  )
}

export default AppBar
