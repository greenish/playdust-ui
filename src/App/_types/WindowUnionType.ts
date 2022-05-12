import allWindowOptions from '../_helpers/allWindowOptions';

type WindowTuple = typeof allWindowOptions;
type WindowUnionType = WindowTuple[number];

export default WindowUnionType;
