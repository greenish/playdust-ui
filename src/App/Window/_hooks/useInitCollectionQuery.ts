import { nanoid } from 'nanoid';
import ComposedQueryType from '../../../_types/ComposedQueryType';
import makeUseQueryChange from '../_helpers/makeUseQueryChange';

const useInitCollectionQuery = makeUseQueryChange<string>(
  () => (collectionId: string) => {
    const next: ComposedQueryType = [
      [
        {
          field: 'collection',
          value: collectionId,
          id: nanoid(),
        },
      ],
    ];

    return { query: next };
  }
);

export default useInitCollectionQuery;
