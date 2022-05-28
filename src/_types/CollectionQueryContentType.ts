import { Infer, literal, string, type } from 'superstruct';

type CollectionQueryContentType = Infer<typeof CollectionQueryContentType>;
const CollectionQueryContentType = type({
  field: literal('collection'),
  value: string(),
});

export default CollectionQueryContentType;
