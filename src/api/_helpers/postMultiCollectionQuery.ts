import type OpenSearchCollectionSourceType from '../../_types/OpenSearchCollectionSourceType';
import makePostMultiQuery from './makePostMultiQuery';

const postMutliCollectionQuery =
  makePostMultiQuery<OpenSearchCollectionSourceType>();

export default postMutliCollectionQuery;
