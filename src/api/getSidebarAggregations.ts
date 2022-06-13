import { array, string, type } from 'superstruct';
import SearchAggResponseType from '../App/Window/WindowInput/_types/SearchAggResponseType';
import getCollectionsByIdsBody from './_helpers/getCollectionsByIdBody';
import nextApiHandler from './_helpers/nextApiHandler';
import searchCollections from './_helpers/searchCollections';

const SidebarAggBody = type({
  collectionIds: array(string()),
});

const getSidebarAggregations = nextApiHandler<SearchAggResponseType>(
  async (req) => {
    const { collectionIds } = SidebarAggBody.create(req.body);
    const [collectionResults] = await searchCollections([
      {
        body: getCollectionsByIdsBody(collectionIds),
        options: { includeAttributes: true },
      },
    ]);

    return collectionResults.sources[0].attributes;
  }
);

export default getSidebarAggregations;
