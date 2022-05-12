import type WindowUnionType from '../_types/WindowUnionType';
import allWindowOptions from './allWindowOptions';

const isInWindowUnionType = (value: string): value is WindowUnionType =>
  allWindowOptions.includes(value as WindowUnionType);

export default isInWindowUnionType;
