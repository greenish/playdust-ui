import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-use'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { userProfile } from '../me/store'
import SearchInput from './components/SearchInput'
import WindowSwitch from './components/WindowSwitch'
import getWindowType from './helpers/getWindowType'
import { decodeWindowHash, encodeWindowHash } from './helpers/getWindowUrl'
import * as store from './store'
import type WindowProps from './types/WindowProps'

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
  const [didMount, setDidMount] = useState(false)
  const { tabs } = useRecoilValue(store.appState)
  const setTabState = store.useSetTabState()
  const addTab = store.useAddTab()
  const removeTab = store.useRemoveTab()
  const activeTab = useRecoilValue(store.activeTab)
  const setSelectedTab = store.useSetSelectedTab()
  const location = useLocation()
  const router = useRouter()
  const profile = useRecoilValue(userProfile)

  const props = useMemo<WindowProps>(() => {
    const currentId = activeTab?.id || ''
    const state = activeTab?.windows[0]?.state || ''
    const type = activeTab?.windows[0]?.type || getWindowType(state)
    const removeCurrentTab = () => removeTab(currentId)

    const props: WindowProps = {
      state,
      removeTab: removeCurrentTab,
      type,
    }

    return props
  }, [activeTab])

  useEffect(() => {
    const { windowState, tab } = decodeWindowHash()

    switch (location.trigger) {
      case 'load': {
        setDidMount(true)

        if (windowState.type === 'home' || windowState.state === '') {
          if (activeTab) {
            const activeState = activeTab.windows[0]
            router.replace(encodeWindowHash(activeState, activeTab.id))
          }
          return
        }

        const found = tabs.find((tab) => {
          const { state, type } = tab.windows[0] || []

          return state === windowState.state && type === windowState.type
        })

        if (!found) {
          const tabId = addTab(windowState)

          router.replace(encodeWindowHash(windowState, tabId))
        } else {
          setSelectedTab(found.id)
        }

        return
      }
      // popstate handles back/forward buttons from browser
      case 'popstate': {
        if (tab) {
          setTabState(windowState, tab)
        }

        return
      }
      case 'pushstate': {
        if (windowState.type === 'home') {
          return setSelectedTab(undefined)
        }

        const found = tabs.find((entry) => entry.id === tab)

        if (found) {
          setTabState(windowState, found.id)
        } else {
          addTab(windowState, tab)
        }

        return
      }
    }
  }, [location])

  if (!didMount) {
    return <></>
  }

  return (
    <RecoilRoot
      key={activeTab?.id || 'home'}
      initializeState={({ set }) => {
        set(userProfile, profile)
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
