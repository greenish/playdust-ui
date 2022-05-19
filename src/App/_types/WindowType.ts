import { array, Infer, object, optional, string } from 'superstruct';
import { WindowUnionType } from './WindowUnionType';

export type WindowType = Infer<typeof WindowType>;
export const WindowType = object({
  state: string(),
  type: WindowUnionType,
  images: optional(array(string())),
});
