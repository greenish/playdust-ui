import { FilterAlt } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
} from '@mui/material'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  useAddAttributeNode,
  usePrependCollectionNode,
  useUpdateAttributeNode,
} from '../../hooks/useSearchChange'
import * as store from '../../store'
import { NFTSource } from '../../types/OpenSearchIndex'

interface TokenCardFilter {
  metadata: NFTSource
}

const TokenCardFilter = ({ metadata }: TokenCardFilter) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const addAttributeNode = useAddAttributeNode()
  const updateAtrributeNode = useUpdateAttributeNode()
  const exactAttributes = useRecoilValue(store.searchQueryAttributes)
  const isCollectionQuery = useRecoilValue(store.isCollectionQuery)
  const attributes = metadata.offChainData.attributes!
  const prependCollectionNode = usePrependCollectionNode()
  const { heuristicCollectionId } = metadata

  return (
    <>
      <IconButton onClick={(evt) => setAnchorEl(evt.currentTarget)}>
        <FilterAlt />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormGroup>
            {!isCollectionQuery && heuristicCollectionId && (
              <Button
                onClick={() => prependCollectionNode(heuristicCollectionId)}
              >
                Search in Collection
              </Button>
            )}
            {attributes.map((attribute) => {
              const found = exactAttributes.find(
                (entry) =>
                  entry.trait === attribute.trait_type &&
                  entry.value?.includes(attribute.value)
              )

              return (
                <FormControlLabel
                  key={`${attribute.trait_type}:${attribute.value}`}
                  control={
                    <Checkbox
                      checked={!!found}
                      onChange={(_evt) => {
                        if (!found) {
                          addAttributeNode({
                            value: [attribute.value],
                            trait: attribute.trait_type,
                            operation: 'and',
                          })
                        } else {
                          updateAtrributeNode({
                            id: found.id,
                            update: {
                              value: found.value.filter(
                                (entry) => entry !== attribute.value
                              ),
                            },
                            clearOnEmpty: true,
                          })
                        }

                        setAnchorEl(null)
                      }}
                    />
                  }
                  label={`${attribute.trait_type}: ${attribute.value}`}
                />
              )
            })}
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  )
}

export default TokenCardFilter
