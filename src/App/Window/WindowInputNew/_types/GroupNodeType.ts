import { array, enums, Infer, object, string } from 'superstruct';

type GroupNodeType = Infer<typeof GroupNodeType>;
const GroupNodeType = object({
  id: string(),
  operator: enums(['and', 'or']),
  children: array(string()),
});

export default GroupNodeType;
