import WindowUnion from '../../../../../../../_types/WindowUnionType';
import ExplorerLinkDisplayProps from '../../_types/ExplorerLinkDisplayPropsType';

interface ExplorerLinkProps extends ExplorerLinkDisplayProps {
  to: string | number;
  label?: string;
  type: WindowUnion;
}
export default ExplorerLinkProps;
