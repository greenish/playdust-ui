import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useMemo } from 'react'
import { useLocation } from 'react-use'
import { RecoilRoot, useRecoilValue } from 'recoil'
import SearchInput from './components/SearchInput'
import WindowSwitch from './components/WindowSwitch'
import getWindowType from './helpers/getWindowType'
import { decodeWindowHash, encodeWindowHash } from './helpers/getWindowUrl'
import * as store from './store'
import { WindowState } from './store'
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
  const { tabs } = useRecoilValue(store.window)
  const setTabState = store.useSetTabState()
  const addTab = store.useAddTab()
  const removeTab = store.useRemoveTab()
  const activeTab = useRecoilValue(store.activeTab)
  const setSelectedTab = store.useSetSelectedTab()
  const location = useLocation()
  const router = useRouter()

  const props = useMemo<WindowProps>(() => {
    const currentId = activeTab?.id || ''
    const state = activeTab?.state[0]?.value || ''
    const type = activeTab?.state[0]?.type || getWindowType(state)
    const removeCurrentTab = () => removeTab(currentId)

    const props: WindowProps = {
      state,
      setState: (nextValue: string) => {
        router.push(
          encodeWindowHash({
            type,
            value: nextValue,
          })
        )
      },
      addTab: (nextState: WindowState) => {
        const tabId = addTab(nextState)
        router.push(encodeWindowHash(nextState, tabId))
      },
      removeTab: removeCurrentTab,
      type,
    }

    return props
  }, [activeTab])

  useEffect(() => {
    const { windowState, tab } = decodeWindowHash()

    switch (location.trigger) {
      case 'load': {
        if (windowState.type === 'home') {
          return
        }

        const found = tabs.find((tab) => {
          const { value, type } = tab.state[0] || []

          return value === windowState.value && type === windowState.type
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
        }

        return
      }
    }
  }, [location])

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
