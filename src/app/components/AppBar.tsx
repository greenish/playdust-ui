import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Add, Close, DeleteSweep, Home, Search } from '@mui/icons-material'
import {
  createTheme,
  Fab,
  Paper,
  SxProps,
  Theme,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import getCDNUrl from '../../common/helpers/getCDNUrl'
import { usePushWindowHash } from '../helpers/getWindowUrl'
import * as store from '../store'
import { Window } from '../types/App'
import Notifications from './Notifications'
import Playdust from './Playdust'
import WalletButton from './WalletButton'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const appBarWidth = 48
const largeButtonSize = 40
const smallButtonSize = 24
const imageAnimationLength = 2

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
  gap: 6px;
  align-items: center;
  width: 100%;
  z-index: 2;
`

const ActiveHighlight = styled.div`
  width: 3px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
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
  size?: number
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  images?: string[]
}>

export const SizedButton = ({
  size = largeButtonSize,
  onClick,
  children,
  images,
}: SizedButtonProps) => {
  const baseStyleProps = {
    maxWidth: size,
    minWidth: size,
    maxHeight: size,
    minHeight: size,
    boxShadow: '0px 0px 2px 0px #fefefe',
    zIndex: 2,
  }

  const sx = useMemo<SxProps<Theme>>(() => {
    if (images) {
      const sliceLength = 100 / images.length
      const keyframeInput = images
        .map((image, idx) => {
          const start = idx === 0 ? '0%,100%' : `${sliceLength * idx}%`

          return `${start} {background-image: url("${getCDNUrl(image)}");}`
        })
        .join('')

      const animation = keyframes(keyframeInput)
      const animationTime = imageAnimationLength * images.length

      return {
        ...baseStyleProps,
        backgroundSize: 'cover',
        animation: `${animation} ${animationTime}s infinite`,
      }
    }

    return baseStyleProps
  }, [size, images])

  return (
    <Fab sx={sx} onClick={onClick}>
      {!images && children}
    </Fab>
  )
}

const getWindowTab = (window: Window): ReactNode | undefined => {
  switch (window.type) {
    case 'home':
      return <Home />
    case 'search':
      return <Search />
    case 'tx':
      return <Typography>T</Typography>
    case 'block':
      return <Typography>B</Typography>
    case 'account':
      return <Typography>A</Typography>
    case 'epoch':
      return <Typography>E</Typography>
    default:
      const n: never = window.type

      return n
  }
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
              {tabs.map((tab) => {
                const isActive = inWindowManager && tab.id === activeTab?.id
                const currentWindow = tab.windows[tab.selectedWindowIdx]

                return (
                  <TabButtonContainer key={tab.id}>
                    <div>
                      <SizedButton
                        size={largeButtonSize}
                        images={currentWindow.images}
                        onClick={() => pushWindowHash(tab.windows[0], tab.id)}
                      >
                        {getWindowTab(currentWindow)}
                      </SizedButton>
                      {isActive && (
                        <ActiveHighlight
                          style={{
                            height: largeButtonSize,
                            background: theme.palette.primary.main,
                          }}
                        />
                      )}
                    </div>
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
