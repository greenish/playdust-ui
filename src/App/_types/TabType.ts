import { array, Infer, number, object, string } from 'superstruct';
import { WindowStateType } from './WindowStateType';

export type TabType = Infer<typeof TabType>;
export const TabType = object({
  id: string(),
  windows: array(WindowStateType),
  selectedWindowIdx: number(),
});
