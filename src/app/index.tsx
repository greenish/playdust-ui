import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { Suspense, useMemo } from 'react'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { userProfile } from '../me/store'
import SearchInput from './components/SearchInput'
import WindowSwitch from './components/WindowSwitch'
import getWindowType from './helpers/getWindowType'
import { usePushWindowHash } from './helpers/getWindowUrl'
import useRouteApp from './hooks/useRouteApp'
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
  const activeTab = useRecoilValue(store.activeTab)
  const profile = useRecoilValue(userProfile)
  const pushWindowHash = usePushWindowHash()

  const props = useMemo<WindowProps>(() => {
    const currentId = activeTab?.id || ''
    const state = activeTab?.windows[0]?.state || ''
    const type = activeTab?.windows[0]?.type || getWindowType(state)

    const props: WindowProps = {
      state,
      clearState: () => {
        pushWindowHash({ type: 'home', state: '' }, currentId)
      },
      type,
    }

    return props
  }, [activeTab])

  const { didMount } = useRouteApp()

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
