import AttributeQueryNodeType from '../../_types/AttributeQueryNodeType';

type AttributeQueryMapType = {
  [key: string]: {
    [value: string]: AttributeQueryNodeType;
  };
};

export default AttributeQueryMapType;
