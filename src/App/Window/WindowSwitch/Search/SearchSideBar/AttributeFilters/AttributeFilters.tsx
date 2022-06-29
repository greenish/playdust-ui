import styled from '@emotion/styled';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import findTopLevelAttributeAtom from '../../../_atoms/findTopLevelAttributeAtom';
import useAddCollectionQueryNode from '../../../_hooks/useAddCollectionQueryNode';
import useToggleTopLevelAttributeNode from '../../../_hooks/useToggleTopLevelAttributeNode';
import ExplorerAccordion from '../../../_sharedComponents/ExplorerAccordion';
import searchTopAggregationAtom from './_atoms/searchTopAggregationAtom';

const RootContainer = styled(Scrollbars)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
`;

const showCollectionsAtom = atom<boolean>({
  key: 'showCollectionsAtom',
  default: false,
});

const showAllAttributesAtom = atom<{ [key: string]: boolean }>({
  key: 'showAllAttributesAtom',
  default: {},
});

const attributeFilterDataAtom = selector({
  key: 'attributeFilterDataAtom',
  get: ({ get }) => {
    const aggregations = get(searchTopAggregationAtom);
    const findAttribute = get(findTopLevelAttributeAtom);
    const showAll = get(showAllAttributesAtom);

    const attributes = aggregations.attributes.map((attribute) => {
      const isExpanded = showAll[attribute.key] || false;
      const values = attribute.values
        .map((entry) => ({
          id: entry.value,
          label: entry.value,
          count: entry.count,
          checked: !!findAttribute(attribute.key, entry.value),
        }))
        .sort(
          (a, b) => Number(b.checked) - Number(a.checked) || b.count - a.count
        )
        .filter((entry) => {
          if (isExpanded) {
            return true;
          }

          return entry.checked;
        });

      return {
        key: attribute.key,
        values,
        isExpanded,
        expandIcon:
          !isExpanded && values.length > 0 ? <ExpandLess /> : <ExpandMore />,
      };
    });

    const collections = aggregations.collections.map((collection) => ({
      id: collection.id,
      label: collection.name,
      count: collection.count,
      checked: false,
    }));

    return { attributes, collections };
  },
});

interface AttributeAccordianProps {
  title: string;
  expandIcon?: React.ReactNode;
  values: {
    id: string;
    label: string;
    count: number;
    checked: boolean;
  }[];
  expanded: boolean;
  onAccordianChange: () => void;
  onToggle: (id: string) => void;
}

function AttributeAccordian({
  title,
  expandIcon,
  values,
  expanded,
  onAccordianChange,
  onToggle,
}: AttributeAccordianProps) {
  return (
    <ExplorerAccordion
      className="disable-padding"
      title={title}
      expandIcon={expandIcon}
      content={
        <FormGroup>
          {values.map(({ id, label, checked, count }) => (
            <FormControlLabel
              key={id}
              control={
                <Checkbox
                  sx={{ ml: 2 }}
                  size="small"
                  checked={checked}
                  onChange={() => onToggle(id)}
                />
              }
              label={
                <Typography sx={{ fontSize: '80%' }}>
                  {label} ({count})
                </Typography>
              }
            />
          ))}
        </FormGroup>
      }
      expanded={expanded}
      onChange={onAccordianChange}
    />
  );
}

function AttributeFilters() {
  const { attributes, collections } = useRecoilValue(attributeFilterDataAtom);
  const [showAll, setShowAll] = useRecoilState(showAllAttributesAtom);
  const [showCollections, setShowCollections] =
    useRecoilState(showCollectionsAtom);
  const toggleAttribute = useToggleTopLevelAttributeNode();
  const addCollectionQueryNode = useAddCollectionQueryNode();

  return (
    <RootContainer autoHide={true}>
      <ContentContainer>
        {collections.length ? (
          <AttributeAccordian
            title="Collections"
            expanded={showCollections}
            values={collections}
            onToggle={(collectionId) =>
              addCollectionQueryNode(collectionId, false, true)
            }
            onAccordianChange={() => setShowCollections(!showCollections)}
          />
        ) : null}
        {attributes.map((attribute) => (
          <AttributeAccordian
            key={attribute.key}
            title={attribute.key}
            expandIcon={attribute.expandIcon}
            expanded={attribute.values.length > 0}
            values={attribute.values}
            onToggle={(attributeValue) =>
              toggleAttribute(attribute.key, attributeValue)
            }
            onAccordianChange={() => {
              setShowAll({
                ...showAll,
                [attribute.key]: !attribute.isExpanded,
              });
            }}
          />
        ))}
      </ContentContainer>
    </RootContainer>
  );
}

export default AttributeFilters;
