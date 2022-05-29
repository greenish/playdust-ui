import styled from '@emotion/styled';
import { ManageSearch, Warning } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
} from '@mui/material';
import { useDebounceCallback } from '@react-hook/debounce';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import useGoHome from '../../_hooks/useGoHome';
import usePushWindowHash from '../../_hooks/usePushWindowHash';
import currentStateAtom from '../_atoms/currentStateAtom';
import searchQueryValidAtom from '../_atoms/searchQueryValidAtom';
import searchResultsAtom from '../_atoms/searchResultsAtom';
import searchStateUncommittedAtom from '../_atoms/searchStateUncommittedAtom';
import serializeSearch from '../_helpers/serializeSearch';
import useAddAttributeQueryNode from '../_hooks/useAddAttributeQueryNode';
import usePrependCollectionQueryNode from '../_hooks/usePrependCollectionQueryNode';
import SearchChips from './SearchChips';
import SearchGraph from './SearchGraph/SearchGraph';
import SuggestionResult from './SuggestionResult';
import isSearchQueryValidAtom from './_atoms/isSearchQueryValidAtom';
import searchSuggestionsAtom from './_atoms/searchSuggestionsAtom';
import searchSuggestionTermAtom from './_atoms/searchSuggestionTermAtom';
import getWindowType from './_helpers/getWindowType';
import useAddTextQueryNode from './_hooks/useAddTextQueryNode';

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

function WindowInput() {
  const windowState = useRecoilValue(currentStateAtom);
  const isQueryValid = useRecoilValue(isSearchQueryValidAtom);
  const searchQueryValid = useRecoilValue(searchQueryValidAtom);
  const uncommitted = useRecoilValue(searchStateUncommittedAtom);
  const loadable = useRecoilValueLoadable(searchResultsAtom);
  const addTextQueryNode = useAddTextQueryNode();
  const addAttributeQueryNode = useAddAttributeQueryNode();
  const prependCollectionQueryNode = usePrependCollectionQueryNode();
  const pushWindowHash = usePushWindowHash();
  const goHome = useGoHome();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [suggestionTerm, setSuggestionTerm] = useRecoilState(
    searchSuggestionTermAtom
  );
  const debouncedSearchSuggestions = useDebounceCallback(
    setSuggestionTerm,
    500
  );
  const { suggestions, loading: suggestionsLoading } = useRecoilValue(
    searchSuggestionsAtom(windowState?.state ?? '')
  );

  if (!windowState) {
    return null;
  }

  const { state, type } = windowState;
  const isSearchable = type === 'search' || type === 'home';

  const filterOnServer = state === '';

  const height = window.innerHeight * 0.8;

  const handleClose = () => {
    if (!isQueryValid) {
      return;
    }

    pushWindowHash({
      type: 'search',
      state: serializeSearch(uncommitted),
    });

    setOpen(false);
  };
  const disabled = loadable.state === 'loading' || !isSearchable;

  return (
    <RootContainer>
      <Autocomplete
        size="small"
        open={searchOpen}
        filterOptions={(x) => x}
        onOpen={() => setSearchOpen(true)}
        onClose={() => setSearchOpen(false)}
        onChange={(_evt, onChangeValue, reason) => {
          if (reason === 'clear') {
            return goHome();
          }

          const value = onChangeValue[1];

          if (!value) {
            return undefined;
          }

          setSuggestionTerm('');

          // value is string if enter key is pressed
          if (typeof value === 'string') {
            const windowType = getWindowType(value);

            if (windowType !== 'search') {
              return pushWindowHash({
                type: windowType,
                state: value,
              });
            }

            return addTextQueryNode(value);
          }

          switch (value.group) {
            case 'Collections':
              return value.meta && prependCollectionQueryNode(value.meta);
            case 'Search':
              return addTextQueryNode(suggestionTerm);
            case 'Explorer':
              return pushWindowHash({
                type: value.type,
                state: suggestionTerm,
              });
            case 'Attribute':
              if (!value.attributeMeta) {
                return undefined;
              }

              return addAttributeQueryNode({
                value: [value.attributeMeta.option],
                trait: value.attributeMeta.trait,
                operation: 'and',
              });
            case 'Attribute Value':
              return (
                value.meta &&
                addAttributeQueryNode({
                  value: [value.meta],
                  trait: '',
                  operation: 'and',
                })
              );
            case 'Attribute Trait':
              return (
                value.meta &&
                addAttributeQueryNode({
                  value: [],
                  trait: value.meta,
                  operation: 'and',
                })
              );
            default: 
              return null;
          }
        }}
        freeSolo={true}
        multiple={true}
        fullWidth={true}
        value={['1']}
        options={suggestions}
        groupBy={(option) => option.group}
        renderOption={(props, option) => (
          <SuggestionResult
            key={option.key}
            parentProps={props}
            label={option.label}
            showLoader={
              suggestions[suggestions.length - 1].key === option.key &&
              suggestionsLoading
            }
          />
        )}
        renderTags={() =>
          isSearchable ? (
            <SearchChips disabled={disabled} />
          ) : (
            <Chip
              size="small"
              label={`${type}: ${state}`}
              variant="outlined"
              onDelete={() => goHome()}
            />
          )
        }
        filterSelectedOptions={true}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={isSearchable ? 'Search...' : ''}
            onChange={(evt) =>
              filterOnServer
                ? debouncedSearchSuggestions(evt.target.value)
                : setSuggestionTerm(evt.target.value)
            }
          />
        )}
      />
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        disableElevation={true}
        sx={{
          borderRadius: 0,
        }}
        disabled={searchQueryValid.length === 0 || disabled}
      >
        <ManageSearch />
      </Button>
      <Dialog open={open} fullWidth={true} maxWidth="xl" onClose={handleClose}>
        <DialogContent sx={{ height }}>
          <SearchGraph />
        </DialogContent>
        <DialogActions>
          {isQueryValid ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Tooltip title="Invalid Query">
                <Warning color="warning" />
              </Tooltip>
              <Button disabled={true}>Done</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </RootContainer>
  );
}

export default WindowInput;
