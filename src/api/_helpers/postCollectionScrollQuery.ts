import type OpenSearchCollectionSourceType from '../../_types/OpenSearchCollectionSourceType';
import makePostScrollQuery from './makePostScrollQuery';

const postCollectionScrollQuery =
  makePostScrollQuery<OpenSearchCollectionSourceType>();

export default postCollectionScrollQuery;
