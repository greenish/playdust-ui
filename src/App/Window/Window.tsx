import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { Suspense, useMemo } from 'react'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { userProfile } from '../../me/store'
import SearchInput from '../SearchInput/SearchInput'
import activeTabAtom from '../_atoms/activeTab'
import activeWindowAtom from '../_atoms/activeWindow'
import currentState from '../_atoms/currentState'
import usePushWindowHash from '../_hooks/usePushWindowHash'
import useRouteApp from '../_hooks/useRouteApp'
import useSetCurrentWindowState from '../_hooks/useSetCurrentWindowState'
import type WindowProps from '../_types/WindowPropsType'
import WindowSwitch from './WindowSwitch'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`

const SearchInputContainer = styled.div`
  padding: 16px;
  position: sticky;
  width: 100%;
`

const ContentContainer = styled.div`
  overflow: auto;
  height: 100%;
  width: 100%;
`

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`

const App = () => {
  const activeTab = useRecoilValue(activeTabAtom)
  const activeWindow = useRecoilValue(activeWindowAtom)
  const setCurrentWindowState = useSetCurrentWindowState()
  const profile = useRecoilValue(userProfile)
  const pushWindowHash = usePushWindowHash()

  const props = useMemo<WindowProps>(() => {
    const currentId = activeTab.id

    const props: WindowProps = {
      ...activeWindow,
      clearState: () => {
        pushWindowHash({ type: 'home', state: '' }, { tabOverride: currentId })
      },
      setWindowImages: (images: string[]) => {
        const activeImages = (activeWindow.images || []).join(',')
        const nextImages = images.join(',')
        const shouldUpdate = activeImages !== nextImages

        if (shouldUpdate) {
          setCurrentWindowState(
            {
              ...activeWindow,
              images,
            },
            activeTab.id
          )
        }
      },
    }

    return props
  }, [activeTab, activeWindow])

  const { didMount } = useRouteApp()

  if (!didMount) {
    return <></>
  }

  return (
    <RecoilRoot
      key={`${activeTab.id}:${props.state}`}
      initializeState={({ set }) => {
        set(userProfile, profile)
        set(currentState, activeWindow)
      }}
    >
      <RootContainer>
        <SearchInputContainer>
          <SearchInput {...props} />
        </SearchInputContainer>
        <ContentContainer>
          <Suspense
            fallback={
              <SpinnerContainer>
                <CircularProgress />
              </SpinnerContainer>
            }
          >
            <WindowSwitch {...props} />
          </Suspense>
        </ContentContainer>
      </RootContainer>
    </RecoilRoot>
  )
}

export default App
