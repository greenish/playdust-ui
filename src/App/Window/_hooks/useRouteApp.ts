import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-use';
import { useRecoilValue } from 'recoil';
import activeTabAtom from '../../_atoms/activeTabAtom';
import appStateAtom from '../../_atoms/appStateAtom';
import decodeWindowHash from '../../_helpers/decodeWindowHash';
import activeWindowAtom from '../_atoms/activeWindowAtom';
import useAddTab from './useAddTab';
import useReplaceWindowHash from './useReplaceWindowHash';
import useSetCurrentWindowState from './useSetCurrentWindowState';
import useSetSelectedTab from './useSetSelectedTab';

const useRouteApp = () => {
  const [didMount, setDidMount] = useState(false);
  const { tabs } = useRecoilValue(appStateAtom);
  const setCurrentWindowState = useSetCurrentWindowState();
  const addTab = useAddTab();
  const activeTab = useRecoilValue(activeTabAtom);
  const activeWindow = useRecoilValue(activeWindowAtom);
  const setSelectedTab = useSetSelectedTab();
  const location = useLocation();
  const replaceWindowHash = useReplaceWindowHash();

  const handleLocationChange = useCallback(
    (trigger: string) => {
      const { windowState, tab } = decodeWindowHash();
      const isEmptyUrlState = windowState.state === '';
      const foundURLTab = tabs.find((entry) => entry.id === tab);
      const foundInCache = tabs.find((entry) => {
        const { state, type } = entry.windows[0] || [];

        return state === windowState.state && type === windowState.type;
      });

      switch (trigger) {
        case 'load': {
          setDidMount(true);

          // Load active tab from cache when going to root (/)
          if (isEmptyUrlState) {
            return replaceWindowHash(activeWindow, {
              tabOverride: activeTab.id,
            });
          }

          // Add new tab from URL, i.e. shared link
          if (!foundInCache) {
            const { id } = addTab(windowState);
            return replaceWindowHash(windowState, { tabOverride: id });
          }

          // Loading tab from URL
          return setSelectedTab(foundInCache.id);
        }
        case 'popstate':
        case 'pushstate': {
          // Going home on the current tab
          if (isEmptyUrlState && foundURLTab) {
            return setCurrentWindowState(windowState, tab);
          }

          // Navigating to an existing tab
          if (foundInCache && foundURLTab) {
            return setSelectedTab(tab);
          }

          // Adding back deleted tab
          if (!foundURLTab) {
            return addTab(windowState, tab);
          }

          // Navigating to next new state in tab
          return setCurrentWindowState(windowState, foundURLTab.id);
        }
        default:
          return undefined;
      }
    },
    [
      activeTab.id,
      activeWindow,
      addTab,
      replaceWindowHash,
      setCurrentWindowState,
      setSelectedTab,
      tabs,
    ]
  );

  useEffect(() => {
    handleLocationChange(location.trigger);
  }, [location]); // eslint-disable-line

  return { didMount };
};

export default useRouteApp;
