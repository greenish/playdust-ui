import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import type CollectionQueryNodeType from '../../../../../../_types/CollectionQueryNodeType';
import collectionByIdAtom from '../../../../_atoms/collectionById';
import searchQueryChildAtom from '../../../../_atoms/searchQueryChild';

const label = 'is:';

interface CollectionNodeProps {
  id: string;
}

function CollectionNode(props: CollectionNodeProps) {
  const { value } = useRecoilValue(
    searchQueryChildAtom(props.id)
  ) as CollectionQueryNodeType;
  const { state, contents } = useRecoilValueLoadable(collectionByIdAtom(value));
  const collectionName =
    state === 'hasValue' ? contents.name || contents.symbol : value;

  return (
    <FormControl fullWidth={true} sx={{ mt: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} readOnly={true}>
        <MenuItem value={value}>{collectionName}</MenuItem>
      </Select>
    </FormControl>
  );
}

export default CollectionNode;
