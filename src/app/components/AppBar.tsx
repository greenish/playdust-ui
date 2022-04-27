import styled from '@emotion/styled'
import { Add, Close, DeleteSweep } from '@mui/icons-material'
import {
  createTheme,
  Fab,
  Paper,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { PropsWithChildren, ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import { usePushWindowHash } from '../helpers/getWindowUrl'
import * as store from '../store'
import Notifications from './Notifications'
import Playdust from './Playdust'
import WalletButton from './WalletButton'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const appBarWidth = 64
const largeButtonSize = 40
const smallButtonSize = 24

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
  width: 100%;
  padding: 16px 0px;
`

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const TabButtonContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
`

const ActiveHighlight = styled.div`
  width: 5px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  position: absolute;
  right: 0;
  top: 0;
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

interface AppBarProps {
  children: ReactNode
}

type SizedButtonProps = PropsWithChildren<{
  size?: 24 | 40
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  href?: string
}>

export const SizedButton = ({
  size = largeButtonSize,
  onClick,
  children,
  href,
}: SizedButtonProps) => {
  return (
    <Fab
      sx={{
        maxWidth: size,
        minWidth: size,
        maxHeight: size,
        minHeight: size,
      }}
      onClick={onClick}
      href={href}
    >
      {children}
    </Fab>
  )
}

const AppBar = ({ children }: AppBarProps) => {
  const { tabs } = useRecoilValue(store.appState)
  const activeTab = useRecoilValue(store.activeTab)
  const addHomeTab = store.useAddHomeTab()
  const removeTab = store.useRemoveTab()
  const pushWindowHash = usePushWindowHash()
  const router = useRouter()

  if (!router.isReady) {
    return <></>
  }

  const inWindowManager = router.pathname === '/'

  return (
    <>
      <ThemeProvider theme={theme}>
        <VerticalAppBar square elevation={3}>
          <VerticalAppBarContent>
            <TopContainer>
              <Playdust width={largeButtonSize} />
              {tabs.map((tab, idx) => {
                const isActive = inWindowManager && tab.id === activeTab?.id

                return (
                  <TabButtonContainer key={tab.id}>
                    <SizedButton
                      size={largeButtonSize}
                      onClick={() => pushWindowHash(tab.windows[0], tab.id)}
                    >
                      <Typography>{idx + 1}</Typography>
                    </SizedButton>
                    {isActive && (
                      <SizedButton
                        size={smallButtonSize}
                        onClick={() => {
                          const nextTab = removeTab()
                          nextTab &&
                            pushWindowHash(nextTab.windows[0], nextTab.id)
                        }}
                      >
                        <Close fontSize="small" />
                      </SizedButton>
                    )}
                    {isActive && (
                      <ActiveHighlight
                        style={{
                          height: largeButtonSize,
                          background: theme.palette.primary.main,
                        }}
                      />
                    )}
                  </TabButtonContainer>
                )
              })}
              <TabButtonContainer>
                <SizedButton
                  onClick={() => {
                    const newTab = addHomeTab()
                    pushWindowHash(newTab.windows[0], newTab.id)
                  }}
                >
                  <Add />
                </SizedButton>
                {inWindowManager && tabs.length > 0 && (
                  <SizedButton
                    size={24}
                    onClick={() => {
                      localStorage.clear()
                      router.replace('/')
                      router.reload()
                    }}
                  >
                    <DeleteSweep fontSize="small" />
                  </SizedButton>
                )}
              </TabButtonContainer>
            </TopContainer>
            <WalletButton active={!inWindowManager} />
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
