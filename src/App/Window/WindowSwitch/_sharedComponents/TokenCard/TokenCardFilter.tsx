import { FilterAltOutlined } from '@mui/icons-material';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
} from '@mui/material';
import React, { useState } from 'react';
import type OpenSearchNFTSourceType from '../../_types/OpenSearchNFTSourceType';

interface TokenCardFilterProps {
  metadata: OpenSearchNFTSourceType;
}

function TokenCardFilter({ metadata }: TokenCardFilterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const attributes = metadata.offChainData.attributes || [];

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
            {/* {!isCollectionQuery && heuristicCollectionId && (
              <Button
                onClick={() =>
                  prependCollectionQueryNode(heuristicCollectionId)
                }
              >
                Search in Collection
              </Button>
            )} */}
            {attributes.map((attribute) => {
              // const found = exactAttributes.find(
              //   (entry) =>
              //     entry.trait === attribute.trait_type &&
              //     entry.value?.includes(attribute.value)
              // );
              const found = undefined;

              return (
                <FormControlLabel
                  key={`${attribute.trait_type}:${attribute.value}`}
                  control={
                    <Checkbox
                      checked={!!found}
                      onChange={() => {
                        if (!found) {
                          //   addAttributeQueryNode({
                          //     value: [attribute.value],
                          //     trait: attribute.trait_type,
                          //     operation: 'and',
                          //   });
                          // } else {
                          //   updateAtrributeQueryNode({
                          //     id: found.id,
                          //     update: {
                          //       value: found.value.filter(
                          //         (entry) => entry !== attribute.value
                          //       ),
                          //     },
                          //     clearOnEmpty: true,
                          //   });
                        }

                        setAnchorEl(null);
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
