import type AppStateType from '../_types/AppStateType';
import type TabType from '../_types/TabType';
import type WindowType from '../_types/WindowType';
import isInWindowUnion from './isInWindowUnionType';

const validateWindows = (windows: WindowType[]) => {
  if (windows.length === 0) {
    throw new Error('windows must have at least one entry');
  }

  windows.forEach((window) => {
    if (typeof window.state !== 'string') {
      throw new Error('window state is not a string');
    }

    if (!isInWindowUnion(window.type)) {
      throw new Error('invalid window type');
    }
  });
};

const validateTabs = (tabs: TabType[]) => {
  if (!Array.isArray(tabs)) {
    throw new Error('window tabs is not an array');
  }

  if (tabs.length === 0) {
    throw new Error('tabs must have at least one entry');
  }

  tabs.forEach((tab) => {
    if (!Number.isInteger(tab.selectedWindowIdx)) {
      throw new Error('invalid window index');
    }

    if (typeof tab.id !== 'string') {
      throw new Error('tab id is not an array');
    }

    validateWindows(tab.windows);
  });
};

const validateSelectedTabId = (input: unknown) => {
  if (input === undefined || typeof input === 'string') {
    return;
  }

  throw new Error('invalid selected tab id');
};

const parseAppState = (input: string): AppStateType | null => {
  try {
    const appState = JSON.parse(input) as AppStateType;

    validateSelectedTabId(appState.selectedTabId);
    validateTabs(appState.tabs);

    return appState;
  } catch (e) {
    console.error('Unable to validate window state:', e);
    return null;
  }
};

export default parseAppState;
