import type TabType from './TabType';

interface AppStateType {
  tabs: TabType[];
  selectedTabId: string;
}

export default AppStateType;
