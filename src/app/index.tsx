import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { RecoilRoot, useRecoilValue } from 'recoil'
import Search from '../search'
import SearchInput from '../search/components/SearchInput'
import Home from './components/Home'
import * as store from './store'
import WindowProps from './types/WindowProps'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`

const SearchInputContainer = styled.div`
  padding: 8px 16px;
  position: sticky;
  width: 100%;
`

const ContentContainer = styled.div`
  overflow: auto;
`

const App = () => {
  const router = useRouter()
  const selectedTab = useRecoilValue(store.selectedTab)
  const setTabState = store.useSetTabState()
  const addTab = store.useAddTab()
  const removeTab = store.useRemoveTab()

  if (!router.isReady) {
    return <></>
  }

  const props: WindowProps = {
    state: selectedTab?.state[0] || '',
    setState: (nextState: string) => {
      const id = selectedTab?.id || ''

      nextState === '' ? removeTab(id) : setTabState(nextState, id)
    },
    addTab,
  }

  return (
    <RecoilRoot key={selectedTab?.id || 'home'}>
      <RootContainer>
        <SearchInputContainer>
          <SearchInput />
        </SearchInputContainer>
        <ContentContainer>
          {props.state === '' ? (
            <Home {...props} />
          ) : (
            <Search key={props.state} {...props} />
          )}
        </ContentContainer>
      </RootContainer>
    </RecoilRoot>
  )
}

export default App
