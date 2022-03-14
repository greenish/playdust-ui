import styled from '@emotion/styled'
import { Home, SearchRounded } from '@mui/icons-material'
import { IconButton, Paper, Toolbar } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import SeachInput from '../../src/search/components/SearchInput'
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

const SearchInputContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 0 16px;
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
  const router = useRouter()

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
            <Link href="/search">
              <a>
                <IconButton>
                  <SearchRounded />
                </IconButton>
              </a>
            </Link>
          </AppBarLeftContent>
          <SearchInputContainer>
            {router.isReady && router.pathname.startsWith('/search') && (
              <SeachInput />
            )}
          </SearchInputContainer>
          <div>
            <WalletButton />
          </div>
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
