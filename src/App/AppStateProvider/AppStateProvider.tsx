import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-use';
import { LocationSensorState } from 'react-use/lib/useLocation';
import { useRecoilValue } from 'recoil';
import activeTabAtom from '../_atoms/activeTabAtom';
import activeWindowAtom from '../_atoms/activeWindowAtom';
import appStateAtom from '../_atoms/appStateAtom';
import decodeWindowHash from '../_helpers/decodeWindowHash';
import useSetCurrentWindowState from '../_hooks/useSetCurrentWindowState';
import useAddTab from './_hooks/useAddTab';
import useReplaceWindowHash from './_hooks/useReplaceWindowHash';
import useSetSelectedTab from './_hooks/useSetSelectedTab';

function AppStateProvider() {
  const { tabs } = useRecoilValue(appStateAtom);
  const setCurrentWindowState = useSetCurrentWindowState();
  const addTab = useAddTab();
  const activeTab = useRecoilValue(activeTabAtom);
  const activeWindow = useRecoilValue(activeWindowAtom);
  const setSelectedTab = useSetSelectedTab();
  const replaceWindowHash = useReplaceWindowHash();
  const newLocation = useLocation();

  const handleLocationChange = useCallback(
    (location: LocationSensorState) => {
      const { windowState, tab } = decodeWindowHash(location);
      const isEmptyUrlState = windowState.state === '';
      const foundURLTab = tabs.find((entry) => entry.id === tab);
      const foundInCache = tabs.find((entry) => {
        const { state, type } = entry.windows[0] || [];

        return state === windowState.state && type === windowState.type;
      });

      switch (location?.trigger) {
        case 'load': {
          // Load active tab from cache when going to root (/)
          if (isEmptyUrlState) {
            replaceWindowHash(activeWindow, {
              tabOverride: activeTab.id,
            });
            break;
          }

          // Add new tab from URL, i.e. shared link
          if (!foundInCache) {
            const { id } = addTab(windowState);
            replaceWindowHash(windowState, { tabOverride: id });
            break;
          }

          // Loading tab from URL
          setSelectedTab(foundInCache.id);
          break;
        }
        case 'popstate':
        case 'pushstate': {
          // Going home on the current tab
          if (isEmptyUrlState && foundURLTab) {
            setCurrentWindowState(windowState, tab);
            break;
          }

          // Navigating to an existing tab
          if (foundInCache && foundURLTab) {
            setSelectedTab(tab);
            break;
          }

          // Adding back deleted tab
          if (!foundURLTab) {
            addTab(windowState, tab);
            break;
          }

          // Navigating to next new state in tab
          setCurrentWindowState(windowState, foundURLTab.id);
          break;
        }
        default:
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
    handleLocationChange(newLocation);
  }, [newLocation]); // eslint-disable-line

  return null;
}

export default AppStateProvider;
