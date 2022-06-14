import { selector } from 'recoil';
import searchStateAtom from '../../../../../_atoms/searchStateAtom';
import AttributeQueryNodeType from '../../../../../_types/AttributeQueryNodeType';
import topLevelAndChildrenAtom from '../../../../Search/SearchSideBar/_atoms/topLevelAndChildrenAtom';
import AttributeQueryMapType from '../_types/AttributeQueryMapType';

const topLevelAttributesMapAtom = selector<AttributeQueryMapType>({
  key: 'topLevelAttributesMapAtom',
  get: ({ get }) => {
    const { query } = get(searchStateAtom);
    const children = get(topLevelAndChildrenAtom);

    const topLevelAttributes = children.reduce<AttributeQueryMapType>(
      (acc, curr) => {
        const node = query.nodes[curr];

        if (AttributeQueryNodeType.is(node)) {
          return {
            ...acc,
            [node.key]: {
              ...(acc[node.key] || {}),
              [node.value]: node,
            },
          };
        }

        return acc;
      },
      {}
    );

    return topLevelAttributes;
  },
});

export default topLevelAttributesMapAtom;
