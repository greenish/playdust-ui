import type WindowType from './WindowType';

interface TabType {
  id: string;
  windows: WindowType[];
  selectedWindowIdx: number;
}

export default TabType;
