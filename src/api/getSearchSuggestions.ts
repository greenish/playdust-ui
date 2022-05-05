import type { NextApiRequest, NextApiResponse } from 'next';
import type OpenSearchResponseType from '../_types/OpenSearchResponseType';
import type SearchSuggestionResponseType from '../_types/SearchSuggestionResponseType';
import postMutliCollectionQuery from './_helpers/postMultiCollectionQuery';
import queriesToMultiSearch from './_helpers/queriesToMultiSearch';

const getAttributeQuery = (term: string) => ({
  size: 25,
  _source: ['attributes.name', 'attributes.values.v'],
  query: {
    multi_match: {
      fields: ['attributes.name', 'attributes.values.v'],
      query: term,
    },
  },
  highlight: {
    fields: {
      'attributes.name': {},
      'attributes.values.v': {},
      description: {},
      name: {},
    },
  },
  sort: [
    '_score',
    {
      totalVolume: {
        order: 'desc',
      },
    },
  ],
});

const getCollectionQuery = (term: string) => ({
  size: 10,
  query: {
    multi_match: {
      fields: ['description', 'name', 'symbol'],
      query: term,
    },
  },
  _source: {
    exclude: ['attributes'],
  },
  highlight: {
    fields: {
      description: {},
      name: {},
      symbol: {},
    },
  },
  sort: [
    {
      totalVolume: {
        order: 'desc',
      },
    },
  ],
});

type AttributeNameValues = Pick<
  SearchSuggestionResponseType,
  'attributeNames' | 'attributeValues'
>;

const addActual = (highlight: string) => ({
  highlight,
  actual: highlight.replaceAll('<em>', '').replaceAll('</em>', ''),
});

const cleanAttributes = (
  attributeResult: OpenSearchResponseType
): AttributeNameValues => {
  const attributes = attributeResult.hits.hits
    .map((entry) => entry.highlight)
    .reduce<{ names: string[]; values: string[] }>(
      (acc, curr) => {
        const values = curr['attributes.values.v'] || [];
        const names = curr['attributes.name'] || [];

        return {
          names: [...new Set([...acc.names, ...names])],
          values: [...new Set([...acc.values, ...values])],
        };
      },
      { names: [], values: [] }
    );

  const withActual = {
    attributeNames: attributes.names.map(addActual),
    attributeValues: attributes.values.map(addActual),
  };

  return withActual;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchSuggestionResponseType>
) => {
  try {
    const term = req.body.term as string;

    const attributeQuery = getAttributeQuery(term);
    const collectionQuery = getCollectionQuery(term);
    const multiCollectionQuery = queriesToMultiSearch(
      [collectionQuery, attributeQuery],
      'nft-collection'
    );

    const [collectionResult, attributeResult] = await postMutliCollectionQuery(
      multiCollectionQuery
    );

    const attributes = cleanAttributes(attributeResult);
    const collections = collectionResult.hits.hits.map((entry) => ({
      source: entry._source,
      highlight: entry.highlight,
    }));

    res.json({
      collections,
      ...attributes,
    });
  } catch (e) {
    res.status(500).end(e);
  }
};

export default handler;
