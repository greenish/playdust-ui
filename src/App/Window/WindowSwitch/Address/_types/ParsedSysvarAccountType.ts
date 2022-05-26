import { Infer, union } from 'superstruct';
import ParsedSysvarAccountSlotHashesType from './ParsedSysvarAccountSlotHashesType';
import ParsedSysvarAccountStakeHistoryType from './ParsedSysvarAccountStakeHistoryType';

type ParsedSysvarAccountType = Infer<typeof ParsedSysvarAccountType>;
const ParsedSysvarAccountType = union([
  ParsedSysvarAccountSlotHashesType,
  ParsedSysvarAccountStakeHistoryType,
]);

export default ParsedSysvarAccountType;
