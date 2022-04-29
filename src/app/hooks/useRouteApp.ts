import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-use'
import { useRecoilValue } from 'recoil'
import { decodeWindowHash, useReplaceWindowHash } from '../helpers/getWindowUrl'
import * as store from '../store'

const useRouteApp = () => {
  const [didMount, setDidMount] = useState(false)
  const { tabs } = useRecoilValue(store.appState)
  const setCurrentWindowState = store.useSetCurrentWindowState()
  const addTab = store.useAddTab()
  const activeTab = useRecoilValue(store.activeTab)
  const activeWindow = useRecoilValue(store.activeWindow)
  const setSelectedTab = store.useSetSelectedTab()
  const location = useLocation()
  const replaceWindowHash = useReplaceWindowHash()

  const handleLocationChange = useCallback(
    (trigger: string) => {
      const { windowState, tab } = decodeWindowHash()
      const isEmptyUrlState = windowState.state === ''
      const foundURLTab = tabs.find((entry) => entry.id === tab)
      const foundInCache = tabs.find((tab) => {
        const { state, type } = tab.windows[0] || []

        return state === windowState.state && type === windowState.type
      })

      switch (trigger) {
        case 'load': {
          setDidMount(true)

          // Load active tab from cache when going to root (/)
          if (isEmptyUrlState) {
            return replaceWindowHash(activeWindow, activeTab.id)
          }

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
          // Navigating to an existing tab
          if (foundInCache && foundURLTab) {
            return setSelectedTab(tab)
          }

          // Going home on the current tab
          if (isEmptyUrlState && foundURLTab) {
            return setCurrentWindowState(windowState, tab)
          }

          // Adding back deleted tab
          if (!foundURLTab) {
            return addTab(windowState, tab, true)
          }

          // Navigating to next new state in tab
          return setCurrentWindowState(windowState, foundURLTab.id)
        }
      }
    },
    [activeTab, activeWindow, tabs]
  )

  useEffect(() => {
    handleLocationChange(location.trigger)
  }, [location])

  return { didMount }
}

export default useRouteApp
