import WindowUnion from '../../../../_types/WindowUnionType';

interface ExplorerLinkProps {
  to: string | number;
  label?: string;
  allowCopy?: boolean;
  ellipsis?: [number, number];
  type: WindowUnion;
}

export default ExplorerLinkProps;
