import { array, Infer, number, object, string } from 'superstruct';
import { WindowType } from './WindowType';

export type TabType = Infer<typeof TabType>;
export const TabType = object({
  id: string(),
  windows: array(WindowType),
  selectedWindowIdx: number(),
});
