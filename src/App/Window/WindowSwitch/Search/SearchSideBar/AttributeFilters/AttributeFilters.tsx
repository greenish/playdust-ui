import styled from '@emotion/styled';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import findTopLevelAttributeAtom from '../../../_atoms/findTopLevelAttributeAtom';
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

    return aggregations.map((attribute) => {
      const isExpanded = showAll[attribute.key] || false;
      const values = attribute.values
        .map((entry) => ({
          ...entry,
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
  },
});

function AttributeFilters() {
  const attributes = useRecoilValue(attributeFilterDataAtom);
  const [showAll, setShowAll] = useRecoilState(showAllAttributesAtom);
  const toggleAttribute = useToggleTopLevelAttributeNode();

  const originalSortOrder = useMemo(() => {
    const copy = [...attributes];

    return copy
      .sort((a, b) => {
        const aHasChecked = !!a.values.find((entry) => entry.checked);
        const bHasChecked = !!b.values.find((entry) => entry.checked);

        return Number(bHasChecked) - Number(aHasChecked);
      })
      .map((entry) => entry.key);
  }, []); // eslint-disable-line

  return (
    <RootContainer autoHide={true}>
      <ContentContainer>
        {originalSortOrder.map((sortKey) => {
          const attribute = attributes.find((entry) => entry.key === sortKey);

          if (!attribute) {
            return null;
          }

          return (
            <ExplorerAccordion
              key={attribute.key}
              itemType="table"
              title={attribute.key}
              expandIcon={attribute.expandIcon}
              content={
                <FormGroup>
                  {attribute.values.map(({ value, checked, count }) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          sx={{ ml: 2 }}
                          size="small"
                          checked={checked}
                          onChange={() => toggleAttribute(attribute.key, value)}
                          name={value.toString()}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: '80%' }}>
                          {value} ({count})
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>
              }
              expanded={attribute.values.length > 0}
              onChange={() => {
                setShowAll({
                  ...showAll,
                  [attribute.key]: !attribute.isExpanded,
                });
              }}
            />
          );
        })}
      </ContentContainer>
    </RootContainer>
  );
}

export default AttributeFilters;
