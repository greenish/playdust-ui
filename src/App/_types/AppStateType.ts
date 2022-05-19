import { array, Infer, object, string } from 'superstruct';
import { TabType } from './TabType';

export type AppStateType = Infer<typeof AppStateType>;
export const AppStateType = object({
  tabs: array(TabType),
  selectedTabId: string(),
});
