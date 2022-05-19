import type { WindowUnionType } from '../../_types/WindowUnionType';

interface WindowPropsType {
  state: string;
  setWindowImages: (images: string[]) => void;
  type: WindowUnionType;
}

export default WindowPropsType;
