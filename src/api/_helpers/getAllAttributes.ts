import AttributeQueryNodeType from '../../_types/AttributeQueryNodeType';
import type AttributeResponseType from '../../_types/AttributeResponseType';
import type ComposedQueryType from '../../_types/ComposedQueryType';
import type OpenSearchNFTSourceType from '../../_types/OpenSearchNFTSourceType';
import type OpenSearchResponseType from '../_types/OpenSearchResponseType';
import getAttributeAggQuery from './getAttributeAggQuery';
import getNFTQuery from './getNFTQuery';

export interface AttributeAggregationType {
  name: {
    trait: {
      buckets: {
        key: string;
        value: {
          buckets: {
            key: string;
          }[];
        };
      }[];
    };
  };
}

const getAllAttributes = (query: ComposedQueryType, nftQuery: object) => {
  const exactAttributeQueries = query.flatMap((parent) =>
    parent.filter((child) => {
      if ('trait' in child && child.field === 'attribute') {
        return true;
      }

      return false;
    })
  ) as AttributeQueryNodeType[];

  const modifiedQueries = exactAttributeQueries.map((entry) => {
    const withoutValue = query.map((parent) =>
      parent.map((child) => {
        if (child.id === entry.id) {
          return {
            ...child,
            value: undefined,
          };
        }

        return child;
      })
    );

    return getNFTQuery(withoutValue as ComposedQueryType, 0);
  });

  const attributeQueries = [nftQuery, ...modifiedQueries].map((entry) => ({
    ...entry,
    ...getAttributeAggQuery(),
  }));

  return {
    attributeQueries,
    cleanAttributes: (
      attributeResults: OpenSearchResponseType<
        OpenSearchNFTSourceType,
        AttributeAggregationType
      >[]
    ) => {
      const [base, ...results]: AttributeResponseType[] = attributeResults.map(
        (data) =>
          data.aggregations.name.trait.buckets.map((entry) => ({
            trait: entry.key,
            options: entry.value.buckets.map((y) => y.key).filter(Boolean),
          }))
      );

      const normalizedAggs = exactAttributeQueries.reduce((acc, curr, idx) => {
        const result = results[idx];
        const found = result.find((entry) => entry.trait === curr.trait);
        const filtered = acc.filter((entry) => entry.trait !== found?.trait);

        if (found) {
          const sorted = [
            ...filtered.slice(0, idx),
            found,
            ...filtered.slice(idx),
          ];

          return sorted;
        }

        return acc;
      }, base);

      return normalizedAggs;
    },
  };
};

export default getAllAttributes;
