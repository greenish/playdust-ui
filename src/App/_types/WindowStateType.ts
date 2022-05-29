import { array, Infer, object, optional, string } from 'superstruct';
import { WindowUnionType } from './WindowUnionType';

export type WindowStateType = Infer<typeof WindowStateType>;
export const WindowStateType = object({
  tabId: string(),
  state: string(),
  type: WindowUnionType,
  images: optional(array(string())),
});
