import { assign, Infer } from 'superstruct';
import QueryNodeIdType from './QueryNodeIdType';
import TextQueryContentType from './TextQueryContentType';

type TextQueryNodeType = Infer<typeof TextQueryNodeType>;
const TextQueryNodeType = assign(TextQueryContentType, QueryNodeIdType);

export default TextQueryNodeType;
