import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-use';
import { LocationSensorState } from 'react-use/lib/useLocation';
import { useRecoilValue } from 'recoil';
import appStateAtom from '../_atoms/appStateAtom';
import decodeWindowHash from './_helpers/decodeWindowHash';
import useSetCurrentWindowState from '../_hooks/useSetCurrentWindowState';
import useAddTab from './_hooks/useAddTab';
import useReplaceWindowHash from './_hooks/useReplaceWindowHash';
import useSetSelectedTab from './_hooks/useSetSelectedTab';
import { nanoid } from 'nanoid';

function AppStateProvider() {
  const { tabs } = useRecoilValue(appStateAtom);
  const setCurrentWindowState = useSetCurrentWindowState();
  const addTab = useAddTab();
  const setSelectedTab = useSetSelectedTab();
  const replaceWindowHash = useReplaceWindowHash();
  const newLocation = useLocation();

  const handleLocationChange = useCallback(
    (location: LocationSensorState) => {
      const windowHash = decodeWindowHash(location);
      const foundURLTab = tabs.find((entry) => entry.id === windowHash.tabId);
      const foundInCache = tabs.find((entry) => {
        const { state, type, tabId } = entry.windows[0] || {};

        return (
          state === windowHash.state 
          && type === windowHash.type
          && tabId === windowHash.tabId
        );
      });

      const windowState = {
        type: windowHash.type,
        state: windowHash.state ?? '',
        tabId: windowHash.tabId ?? nanoid()
      };
      
      switch (location?.trigger) {
        case 'load': {
          // Loading tab from URL
          if(foundInCache) {
            setSelectedTab(foundInCache.id);
            break;
          }

          // Add new tab from URL, i.e. shared link
          if (windowHash.tabId) {
            addTab(windowState);
          }         

          replaceWindowHash(windowState);
          break;
        }
        case 'popstate':
        case 'pushstate': {
          // Navigating to an existing tab
          if (foundInCache) {
            setSelectedTab(windowState.tabId);
            break;
          }

          // Adding new tab
          if (!foundURLTab) {
            addTab(windowState);
            break;
          }

          // Navigating to next new state in tab
          setCurrentWindowState(windowState);
          break;
        }
        default:
      }
    },
    [addTab, replaceWindowHash, setCurrentWindowState, setSelectedTab, tabs]
  );

  useEffect(() => {
    handleLocationChange(newLocation);
  }, [newLocation]); // eslint-disable-line

  return null;
}

export default AppStateProvider;
