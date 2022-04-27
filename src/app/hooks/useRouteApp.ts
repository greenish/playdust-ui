import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-use'
import { useRecoilValue } from 'recoil'
import { decodeWindowHash, useReplaceWindowHash } from '../helpers/getWindowUrl'
import * as store from '../store'
import { Window } from '../types/App'

const useRouteApp = () => {
  const [didMount, setDidMount] = useState(false)
  const { tabs } = useRecoilValue(store.appState)
  const setTabState = store.useSetTabState()
  const addTab = store.useAddTab()
  const activeTab = useRecoilValue(store.activeTab)
  const setSelectedTab = store.useSetSelectedTab()
  const location = useLocation()

  const replaceWindowHash = useReplaceWindowHash()

  const handleLocationChange = useCallback(
    (trigger: string) => {
      const { windowState, tab } = decodeWindowHash()
      const homeState: Window = { type: 'home', state: '' }
      const isEmptyUrlState = windowState.state === ''

      switch (trigger) {
        case 'load': {
          setDidMount(true)

          // Load active tab from cache
          if (isEmptyUrlState && activeTab) {
            const activeState = activeTab.windows[0]
            return replaceWindowHash(activeState, activeTab.id)
          }

          const foundInCache = tabs.find((tab) => {
            const { state, type } = tab.windows[0] || []

            return state === windowState.state && type === windowState.type
          })

          // Add new tab from URL, i.e. shared link
          if (!foundInCache) {
            const { id } = addTab(windowState)
            return replaceWindowHash(windowState, id)
          }

          // Loading tab from URL
          return setSelectedTab(foundInCache.id)
        }
        case 'popstate':
        case 'pushstate': {
          const foundURLTab = tabs.find((entry) => entry.id === tab)

          // Clearing current tab state
          if (isEmptyUrlState && foundURLTab) {
            setTabState(homeState, foundURLTab.id)
            return replaceWindowHash(homeState)
          }

          // Adding back deleted tab
          if (!foundURLTab) {
            return addTab(windowState, tab)
          }

          // Navigating to next state in tab
          return setTabState(windowState, foundURLTab.id)
        }
      }
    },
    [activeTab, tabs]
  )

  useEffect(() => {
    handleLocationChange(location.trigger)
  }, [location])

  return { didMount }
}

export default useRouteApp
