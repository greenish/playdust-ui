import { TextField } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import searchQueryChildAtom from '../../../../_atoms/searchQueryChild';
import useUpdateTextQueryNode from '../../../../_hooks/useUpdateTextQueryNode';

interface SearchTextNodeProps {
  id: string;
}
function SearchTextNode(props: SearchTextNodeProps) {
  const data = useRecoilValue(searchQueryChildAtom(props.id));
  const updateTextNode = useUpdateTextQueryNode('memory');

  return (
    <TextField
      variant="outlined"
      sx={{ mt: 1 }}
      defaultValue={data.value}
      onChange={(evt) =>
        updateTextNode({ id: props.id, text: evt.target.value })
      }
    />
  );
}

export default SearchTextNode;
