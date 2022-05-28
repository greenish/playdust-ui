import { Infer, literal, string, type } from 'superstruct';

type TextQueryContentType = Infer<typeof TextQueryContentType>;
const TextQueryContentType = type({
  field: literal('text'),
  value: string(),
});

export default TextQueryContentType;
