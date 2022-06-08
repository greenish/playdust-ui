import { Infer, number, optional, string, type } from 'superstruct';

type OpenSearchCollectionSourceType = Infer<
  typeof OpenSearchCollectionSourceType
>;
const OpenSearchCollectionSourceType = type({
  id: string(),
  symbol: string(),
  name: string(),
  description: string(),
  family: optional(string()),
  elementCount: number(),
  totalVolume: number(),
  floorPrice: number(),
});

export default OpenSearchCollectionSourceType;
