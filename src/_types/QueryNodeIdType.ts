import { boolean, Infer, literal, optional, string, type } from 'superstruct';

type QueryNodeIdType = Infer<typeof QueryNodeIdType>;
const QueryNodeIdType = type({
  id: string(),
  type: optional(literal('query')),
  locked: optional(boolean()),
});

export default QueryNodeIdType;
