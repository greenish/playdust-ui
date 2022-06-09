import type {
  AggregationsAggregate,
  MsearchResponse,
  SearchRequest,
  SearchResponse,
  SearchTotalHits,
} from '@opensearch-project/opensearch/api/types';
import { array, Struct } from 'superstruct';
import osClient from './osClient';

const getOSTotalValue = (total: SearchTotalHits | number) => {
  if (typeof total === 'number') {
    return total;
  }

  return total.value;
};

type RequestBodyType = SearchRequest['body'];
type SearchOSReturnType<SourceType> = {
  sources: SourceType[];
  total: number;
  aggregations: Record<string, AggregationsAggregate> | undefined;
  highlights: (Record<string, string[]> | undefined)[];
};
type GetSearchBodyType<OptionsType> = (
  body: RequestBodyType,
  options: OptionsType | undefined
) => RequestBodyType;

function makeSearchOS<SourceType, OptionsType>(
  index: 'nft-metadata' | 'nft-collection',
  struct: Struct<SourceType>,
  getSearchBody: GetSearchBodyType<OptionsType>
) {
  return async (
    bodies: RequestBodyType[],
    options?: OptionsType
  ): Promise<SearchOSReturnType<SourceType>[]> => {
    const creator = array(struct);

    if (bodies.length === 1) {
      const body = getSearchBody(bodies[0], options);

      const results = await osClient.search<SearchResponse<SourceType>>({
        index,
        body,
      });

      const sources = results.body.hits.hits.reduce<SourceType[]>(
        (acc, curr) => {
          const source = curr._source;

          if (source) {
            return [...acc, source];
          }

          return acc;
        },
        []
      );
      const { aggregations } = results.body;
      const highlights = results.body.hits.hits.map((entry) => entry.highlight);

      return [
        {
          sources: creator.create(sources),
          aggregations,
          total: getOSTotalValue(results.body.hits.total),
          highlights,
        },
      ];
    }

    const mSearchBody = bodies.flatMap((body) => [
      `{ "index": "${index}" }`,
      JSON.stringify(getSearchBody(body, options)),
    ]);

    const mSearchResults = await osClient.msearch<
      MsearchResponse<SourceType>,
      string[]
    >({
      body: mSearchBody,
    });

    const responses = mSearchResults.body.responses.reduce<
      SearchOSReturnType<SourceType>[]
    >((acc, curr) => {
      if ('error' in curr) {
        return acc;
      }

      const { aggregations } = curr;

      const sources = curr.hits.hits.reduce<SourceType[]>((yAcc, yCurr) => {
        if (!yCurr._source) {
          return yAcc;
        }

        return [...yAcc, yCurr._source];
      }, []);

      const highlights = curr.hits.hits.map((entry) => entry.highlight);

      return [
        ...acc,
        {
          sources: creator.create(sources),
          aggregations,
          total: getOSTotalValue(curr.hits.total),
          highlights,
        },
      ];
    }, []);

    return responses;
  };
}

export default makeSearchOS;
