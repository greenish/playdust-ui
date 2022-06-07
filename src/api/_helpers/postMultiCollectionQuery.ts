import type OpenSearchCollectionSourceType from '../../App/Window/_types/OpenSearchCollectionSourceType';
import makePostMultiQuery from './makePostMultiQuery';

const postMutliCollectionQuery = makePostMultiQuery<
  OpenSearchCollectionSourceType,
  void
>();

export default postMutliCollectionQuery;
