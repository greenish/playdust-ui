import styled from '@emotion/styled';
import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useAddRangeQueryNode from '../../../_hooks/useAddRangeQueryNode';
import useRemoveQueryNode from '../../../_hooks/useRemoveQueryNode';
import useUpdateRangeQueryNode from '../../../_hooks/useUpdateRangeQueryNode';
import RangeInput from '../../../_sharedComponents/RangeInput';
import rangeQueryByNameAtom from '../_atoms/rangeQueryByName';
import searchFiltersAtom, { SearchFilterType } from '../_atoms/searchFilters';

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
`;

function RangeFilter({ label, name }: SearchFilterType) {
  const addRangeQueryNode = useAddRangeQueryNode();
  const removeQueryNode = useRemoveQueryNode();
  const queryValue = useRecoilValue(rangeQueryByNameAtom(name));
  const updateRangeQueryNode = useUpdateRangeQueryNode();

  const [local, setLocal] = useState({
    visible: false,
    min: 0,
    max: 0,
  });

  const { visible, setVisible, min, max } = useMemo(() => {
    if (queryValue) {
      return {
        visible: true,
        min: queryValue.min,
        max: queryValue.max,
        setVisible: () => removeQueryNode(queryValue.id),
      };
    }

    return {
      visible: local.visible,
      min: undefined,
      max: undefined,
      setVisible: (newValue: boolean) =>
        setLocal({ ...local, visible: newValue }),
    };
  }, [local, queryValue, removeQueryNode]);

  return (
    <ItemContainer key={name}>
      <FormControlLabel
        control={
          <Checkbox
            checked={visible}
            size="small"
            onChange={() => setVisible(!visible)}
          />
        }
        label={label}
      />
      {visible && (
        <RangeInput
          min={min}
          max={max}
          value={name}
          onApply={(newValue) =>
            queryValue
              ? updateRangeQueryNode({ id: queryValue.id, update: newValue })
              : addRangeQueryNode(newValue)
          }
          sol={name !== 'rarity-score'}
        />
      )}
    </ItemContainer>
  );
}

function RangeFilters() {
  const filters = useRecoilValue(searchFiltersAtom);

  return (
    <>
      {filters.map((filter) => (
        <RangeFilter key={filter.name} {...filter} />
      ))}
    </>
  );
}

export default RangeFilters;
