import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import type CollectionQueryNodeType from '../../../../../../_types/CollectionQueryNodeType';
import collectionByIdAtom from '../../../../_atoms/collectionByIdAtom';
import searchQueryChildAtom from '../_atoms/searchQueryChildAtom';

const label = 'is:';

interface CollectionNodeProps {
  id: string;
}

function CollectionNode(props: CollectionNodeProps) {
  const { value } = useRecoilValue(
    searchQueryChildAtom(props.id)
  ) as CollectionQueryNodeType;
  const collectionById = useRecoilValueLoadable(collectionByIdAtom(value));
  const collectionName =
    collectionById.state === 'hasValue'
      ? collectionById.contents.name || collectionById.contents.symbol
      : value;

  return (
    <FormControl fullWidth={true} sx={{ mt: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} readOnly={true}>
        <MenuItem value={value}>{collectionName}</MenuItem>
      </Select>
    </FormControl>
  );
}

export default CollectionNode;
