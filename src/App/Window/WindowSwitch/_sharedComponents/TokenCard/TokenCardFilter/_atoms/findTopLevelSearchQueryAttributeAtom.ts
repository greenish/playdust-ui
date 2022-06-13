import { selector } from 'recoil';
import searchStateAtom from '../../../../../_atoms/searchStateAtom';
import AttributeQueryNodeType from '../../../../../_types/AttributeQueryNodeType';
import topLevelAndChildrenAtom from '../../../../Search/SearchSideBar/_atoms/topLevelAndChildrenAtom';

const findTopLevelSearchQueryAttributeAtom = selector<
  (key: string, value: string) => AttributeQueryNodeType | undefined
>({
  key: 'findTopLevelSearchQueryAttributeAtom',
  get: ({ get }) => {
    const { query } = get(searchStateAtom);
    const children = get(topLevelAndChildrenAtom);
    const topLevelAttributes = children.reduce<AttributeQueryNodeType[]>(
      (acc, curr) => {
        const node = query.nodes[curr];

        if (AttributeQueryNodeType.is(node)) {
          return [...acc, node];
        }

        return acc;
      },
      []
    );

    return (key, value) =>
      topLevelAttributes.find(
        (entry) => entry.key === key && entry.value === value
      );
  },
});

export default findTopLevelSearchQueryAttributeAtom;
