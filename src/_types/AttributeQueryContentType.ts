import { array, Infer, literal, string, type } from 'superstruct';

type AttributeQueryContentType = Infer<typeof AttributeQueryContentType>;
const AttributeQueryContentType = type({
  field: literal('attribute'),
  value: array(string()),
  trait: string(),
});

export default AttributeQueryContentType;
