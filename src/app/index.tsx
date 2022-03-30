import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useMemo } from 'react'
import { RecoilRoot, useRecoilValue } from 'recoil'
import SearchInput from './components/SearchInput'
import WindowSwitch from './components/WindowSwitch'
import getWindowType from './helpers/getWindowType'
import * as store from './store'
import WindowProps from './types/WindowProps'

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
  const router = useRouter()
  const selectedTab = useRecoilValue(store.selectedTab)
  const setTabState = store.useSetTabState()
  const addTab = store.useAddTab()
  const removeTab = store.useRemoveTab()

  const props = useMemo<WindowProps>(() => {
    const currentId = selectedTab?.id || ''
    const state = selectedTab?.state[0] || ''
    const removeCurrentTab = () => removeTab(currentId)

    const props: WindowProps = {
      state,
      setState: (nextState: string) => {
        nextState === '' ? removeCurrentTab : setTabState(nextState, currentId)
      },
      addTab,
      removeTab: removeCurrentTab,
      type: getWindowType(state),
    }

    return props
  }, [selectedTab])

  useEffect(() => {
    const handleRouteChange = (nextPath: string) => {
      if (nextPath.startsWith('/?')) {
        const nextState = nextPath.slice(nextPath.indexOf('=') + 1)
        props.setState(nextState)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [props])

  if (!router.isReady) {
    return <></>
  }

  return (
    <RecoilRoot key={selectedTab?.id || 'home'}>
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
