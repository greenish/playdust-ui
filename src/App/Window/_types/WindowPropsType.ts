import type WindowUnion from '../../_types/WindowUnionType';

interface WindowProps {
  state: string;
  clearState: () => void;
  setWindowImages: (images: string[]) => void;
  type: WindowUnion;
}

export default WindowProps;
