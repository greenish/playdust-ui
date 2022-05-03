import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Add, Close, DeleteSweep, Home, Search } from '@mui/icons-material'
import { Fab, SxProps, Theme, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import Playdust from './PlaydustIcon'
import WalletButton from './WalletButton'
import activeTabAtom from './_atoms/activeTab'
import type { WindowType } from './_atoms/appState'
import appStateAtom from './_atoms/appState'
import getCDNUrl from './_helpers/getCDNUrl'
import useGoToNewTab from './_hooks/useGoToNewTab'
import useGoToTab from './_hooks/useGoToTab'
import useRemoveTab from './_hooks/useRemoveTab'

export const appBarWidth = 48
const largeButtonSize = 40
const smallButtonSize = 24
const imageAnimationLength = 2

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 16px 0px;
  width: ${appBarWidth}px;
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

type SizedButtonProps = PropsWithChildren<{
  size?: number
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  images?: string[]
}>

const SizedButton = ({
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

const getWindowTab = (window: WindowType): ReactNode | undefined => {
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

const AppBar = () => {
  const { tabs } = useRecoilValue(appStateAtom)
  const activeTab = useRecoilValue(activeTabAtom)
  const removeTab = useRemoveTab()
  const goToTab = useGoToTab()
  const goToNewTab = useGoToNewTab()
  const router = useRouter()
  const theme = useTheme()

  if (!router.isReady) {
    return <></>
  }

  const inWindowManager = router.pathname === '/'

  return (
    <RootContainer>
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
                  onClick={() => goToTab(tab)}
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
                <SizedButton size={smallButtonSize} onClick={() => removeTab()}>
                  <Close fontSize="small" />
                </SizedButton>
              )}
            </TabButtonContainer>
          )
        })}
        <TabButtonContainer>
          <SizedButton onClick={() => goToNewTab()}>
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
    </RootContainer>
  )
}

export default AppBar