import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useMemo } from 'react'
import { RecoilRoot, useRecoilValue } from 'recoil'
import SearchInput from './components/SearchInput'
import WindowSwitch from './components/WindowSwitch'
import getWindowType from './helpers/getWindowType'
import { decodeWindowSearch } from './helpers/getWindowUrl'
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
`

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`

const App = () => {
  const tabs = useRecoilValue(store.tabs)
  const setTabState = store.useSetTabState()
  const addTab = store.useAddTab()
  const removeTab = store.useRemoveTab()
  const activeTab = useRecoilValue(store.activeTab)
  const setSelectedTab = store.useSetSelectedTab()
  const router = useRouter()

  const props = useMemo<WindowProps>(() => {
    const currentId = activeTab?.id || ''
    const state = activeTab?.state[0]?.value || ''
    const type = activeTab?.state[0]?.type || getWindowType(state)
    const removeCurrentTab = () => removeTab(currentId)

    const props: WindowProps = {
      key: state,
      state,
      addTab,
      removeTab: removeCurrentTab,
      type,
    }

    return props
  }, [activeTab])

  useEffect(() => {
    const windowState = decodeWindowSearch()

    if (windowState.type === 'home') {
      return
    }

    const found = tabs.find((tab) => {
      const { value, type } = tab.state[0] || []

      return value === windowState.value && type === windowState.type
    })

    if (!found) {
      return addTab(windowState)
    }

    setSelectedTab(found.id)
  }, [])

  useEffect(() => {
    const handleRouteChange = (nextRoute: string) => {
      const cleaned = nextRoute.slice(1)
      if (cleaned === '') {
        return
      }
      const windowState = decodeWindowSearch(cleaned)

      if (!activeTab) {
        return addTab(windowState)
      }

      setTabState(windowState, activeTab.id)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [activeTab, props])

  return (
    <RecoilRoot key={activeTab?.id || 'home'}>
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
