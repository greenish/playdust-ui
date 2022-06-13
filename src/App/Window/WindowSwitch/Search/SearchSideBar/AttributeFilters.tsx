import styled from '@emotion/styled';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useRecoilValue } from 'recoil';
import ExplorerAccordion from '../../_sharedComponents/ExplorerAccordion';
import findTopLevelSearchQueryAttributeAtom from '../../_sharedComponents/TokenCard/TokenCardFilter/_atoms/findTopLevelSearchQueryAttributeAtom';
import useToggleTopLevelAttributeNode from '../../_sharedComponents/TokenCard/TokenCardFilter/_hooks/useToggleTopLevelAttributeNode';
import sidebarAggregationAtom from './_atoms/sidebarAggregationAtom';

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

function AttributeFilters() {
  const attributes = useRecoilValue(sidebarAggregationAtom);
  const findAttribute = useRecoilValue(findTopLevelSearchQueryAttributeAtom);
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
  const toggleAttribute = useToggleTopLevelAttributeNode();

  return (
    <RootContainer autoHide={true}>
      <ContentContainer>
        {attributes.map((attribute) => {
          const isExpanded = showAll[attribute.key] || false;
          const values = attribute.values
            .map((entry) => ({
              ...entry,
              checked: !!findAttribute(attribute.key, entry.value),
            }))
            .sort(
              (a, b) =>
                Number(b.checked) - Number(a.checked) || b.count - a.count
            )
            .filter((entry) => {
              if (isExpanded) {
                return true;
              }

              return entry.checked;
            });
          const ExpandIcon =
            !isExpanded && values.length > 0 ? ExpandLess : ExpandMore;

          return (
            <ExplorerAccordion
              key={attribute.key}
              itemType="table"
              title={attribute.key}
              expandIcon={<ExpandIcon />}
              content={
                <FormGroup>
                  {values.map(({ value, checked, count }) => (
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
              expanded={values.length > 0}
              onChange={() => {
                setShowAll({ ...showAll, [attribute.key]: !isExpanded });
              }}
            />
          );
        })}
      </ContentContainer>
    </RootContainer>
  );
}

export default AttributeFilters;
