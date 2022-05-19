import { is } from 'superstruct';
import { WindowUnionType } from '../_types/WindowUnionType';

const isInWindowUnionType = (value: string) => is(value, WindowUnionType);

export default isInWindowUnionType;
