import { FilterAltOutlined } from '@mui/icons-material';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
} from '@mui/material';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import useRemoveQueryNode from '../../../../_hooks/useRemoveQueryNode';
import type OpenSearchNFTSourceType from '../../../_types/OpenSearchNFTSourceType';
import findTopLevelSearchQueryAttributeAtom from './_atoms/findTopLevelSearchQueryAttributeAtom';
import useAddTopLevelQueryNode from './_hooks/useAddTopLevelQueryNode';

interface TokenCardFilterProps {
  metadata: OpenSearchNFTSourceType;
}

function TokenCardFilter({ metadata }: TokenCardFilterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const attributes = metadata.offChainData.attributes || [];
  const findAttribute = useRecoilValue(findTopLevelSearchQueryAttributeAtom);
  const removeQueryNode = useRemoveQueryNode();
  const addTopLevelQueryNode = useAddTopLevelQueryNode();

  return (
    <>
      <IconButton
        onClick={(evt) => setAnchorEl(evt.currentTarget)}
        size="small"
      >
        <FilterAltOutlined />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormGroup>
            {attributes.map((attribute) => {
              const found = findAttribute(
                attribute.trait_type,
                attribute.value
              );

              return (
                <FormControlLabel
                  key={`${attribute.trait_type}:${attribute.value}`}
                  control={
                    <Checkbox
                      checked={!!found}
                      onChange={() => {
                        setAnchorEl(null);
                        return found
                          ? removeQueryNode(found.id)
                          : addTopLevelQueryNode({
                              id: nanoid(),
                              type: 'query',
                              field: 'attribute',
                              key: attribute.trait_type,
                              value: attribute.value,
                            });
                      }}
                    />
                  }
                  label={`${attribute.trait_type}: ${attribute.value}`}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  );
}

export default TokenCardFilter;
