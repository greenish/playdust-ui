import type WindowUnion from '../../_types/WindowUnionType';

interface WindowPropsType {
  state: string;
  setWindowImages: (images: string[]) => void;
  type: WindowUnion;
}

export default WindowPropsType;
