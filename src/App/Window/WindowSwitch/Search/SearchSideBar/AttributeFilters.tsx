import styled from '@emotion/styled';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import type AttributeQueryNodeType from '../../../../../_types/AttributeQueryNodeType';
import searchAggregationsAtom from '../../../_atoms/searchAggregations';
import searchQueryAttributesAtom from '../../../_atoms/searchQueryAttributes';
import useAddAttributeQueryNode from '../../../_hooks/useAddAttributeQueryNode';
import useUpdateAttributeQueryNode from '../../../_hooks/useUpdateAttributeQueryNode';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% + 16px);
  height: 100%;
  overflow: auto;
  margin-left: -16px;
  padding-left: 16px;
`;

const normalizeOptions = (
  options: string[],
  found: AttributeQueryNodeType | undefined,
  isExpanded: boolean
) => {
  const normalized = options
    .map((option) => ({
      option,
      checked: !!(found && found.value.includes(option)),
    }))
    .sort((a, b) => {
      if (a.checked === b.checked) {
        return 0;
      }

      return a.checked ? -1 : 1;
    });

  if (isExpanded) {
    return normalized;
  }

  const numChecked = normalized.filter((option) => option.checked).length;
  const sliceAmount = Math.max(numChecked, 5);

  return normalized.slice(0, sliceAmount);
};

function AttributeFiltersSkeleton() {
  const count = 10;

  return (
    <>
      {[...Array(count).keys()].map((entry) => (
        <div key={`attribute-skeleton-${entry}`}>
          <Typography variant="h4">
            <Skeleton />
          </Typography>
          <Typography>
            <Skeleton />
          </Typography>
          <Typography>
            <Skeleton />
          </Typography>
          <Typography>
            <Skeleton />
          </Typography>
          <Typography>
            <Skeleton />
          </Typography>
          <Typography>
            <Skeleton />
          </Typography>
          <br />
        </div>
      ))}
    </>
  );
}

function AttributeFilters() {
  const loadable = useRecoilValueLoadable(searchAggregationsAtom);
  const queries = useRecoilValue(searchQueryAttributesAtom);
  const addAttributeQueryNode = useAddAttributeQueryNode();
  const updateAttributeNode = useUpdateAttributeQueryNode();
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});

  if (loadable.state !== 'hasValue') {
    return <AttributeFiltersSkeleton />;
  }

  const { attributes } = loadable.contents;

  return (
    <RootContainer>
      {attributes.map((attribute) => {
        const isExpanded = showAll[attribute.trait] || false;
        const found = queries.find((entry) => entry.trait === attribute.trait);
        const options = normalizeOptions(attribute.options, found, isExpanded);

        return (
          <FormControl
            sx={{ mb: 2 }}
            component="fieldset"
            variant="standard"
            key={attribute.trait}
          >
            <Button
              size="small"
              endIcon={isExpanded ? <ExpandMore /> : <ChevronRight />}
              onClick={() =>
                setShowAll({ ...showAll, [attribute.trait]: !isExpanded })
              }
            >
              {attribute.trait}
            </Button>
            <FormGroup>
              {options.map(({ option, checked }) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={() => {
                        if (!found) {
                          return addAttributeQueryNode({
                            value: [option],
                            trait: attribute.trait,
                            operation: 'and',
                          });
                        }

                        if (!checked) {
                          return updateAttributeNode({
                            id: found.id,
                            update: {
                              value: [...found.value, option],
                            },
                          });
                        }

                        const nextValue = found.value.filter(
                          (entry) => entry !== option
                        );

                        return updateAttributeNode({
                          id: found.id,
                          update: {
                            value: nextValue,
                          },
                          clearOnEmpty: true,
                        });
                      }}
                      name={option.toString()}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
        );
      })}
    </RootContainer>
  );
}

export default AttributeFilters;
