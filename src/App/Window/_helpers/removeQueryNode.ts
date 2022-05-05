import ComposedQueryType from '../../../_types/ComposedQueryType';

const removeQueryNode = (
  state: ComposedQueryType,
  id: string
): ComposedQueryType => {
  const nextQuery = state
    .map((parent) => parent.filter((child) => child.id !== id))
    .filter((parent) => parent.length > 0);

  return nextQuery;
};

export default removeQueryNode;
