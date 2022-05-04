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
import type OpenSearchNFTSourceType from '../../../../../../_types/OpenSearchNFTSourceType'
import isCollectionQueryAtom from '../../../../_atoms/isCollectionQuery'
import searchQueryAttributesAtom from '../../../../_atoms/searchQueryAttributes'
import useAddAttributeQueryNode from '../../../../_hooks/useAddAttributeQueryNode'
import usePrependCollectionQueryNode from '../../../../_hooks/usePrependCollectionQueryNode'
import useUpdateAttributeQueryNode from '../../../../_hooks/useUpdateAttributeQueryNode'

interface TokenCardFilter {
  metadata: OpenSearchNFTSourceType
}

const TokenCardFilter = ({ metadata }: TokenCardFilter) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const addAttributeQueryNode = useAddAttributeQueryNode()
  const updateAtrributeQueryNode = useUpdateAttributeQueryNode()
  const exactAttributes = useRecoilValue(searchQueryAttributesAtom)
  const isCollectionQuery = useRecoilValue(isCollectionQueryAtom)
  const attributes = metadata.offChainData.attributes!
  const prependCollectionQueryNode = usePrependCollectionQueryNode()
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
                onClick={() =>
                  prependCollectionQueryNode(heuristicCollectionId)
                }
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
                          addAttributeQueryNode({
                            value: [attribute.value],
                            trait: attribute.trait_type,
                            operation: 'and',
                          })
                        } else {
                          updateAtrributeQueryNode({
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
