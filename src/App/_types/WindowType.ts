import type WindowUnionType from './WindowUnionType';

interface WindowType {
  state: string;
  type: WindowUnionType;
  images?: string[];
}

export default WindowType;
