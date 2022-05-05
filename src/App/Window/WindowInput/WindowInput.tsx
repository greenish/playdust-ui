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
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useDebounceCallback } from '@react-hook/debounce';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import getWindowType from '../../_helpers/getWindowType';
import usePushWindowHash from '../../_hooks/usePushWindowHash';
import isSearchQueryValidAtom from '../_atoms/isSearchQueryValid';
import searchQueryValidAtom from '../_atoms/searchQueryValid';
import searchResultsAtom from '../_atoms/searchResults';
import searchStateUncommittedAtom from '../_atoms/searchStateUncommitted';
import searchSuggestionsAtom, {
  SearchSuggestionType,
} from '../_atoms/searchSuggestions';
import searchSuggestionTermAtom from '../_atoms/searchSuggestionTerm';
import serializeSearch from '../_helpers/serializeSearch';
import useAddAttributeQueryNode from '../_hooks/useAddAttributeQueryNode';
import useAddTextQueryNode from '../_hooks/useAddTextQueryNode';
import usePrependCollectionQueryNode from '../_hooks/usePrependCollectionQueryNode';
import WindowProps from '../_types/WindowPropsType';
import SearchChips from './SearchChips';
import SearchGraph from './SearchGraph/SearchGraph';
import SuggestionResult from './SuggestionResult';

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const TextFieldInput = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: 0,
  },
}));

const clientFilter = createFilterOptions({
  stringify: (option: SearchSuggestionType) => option.label,
});

function WindowInput({ state, type, clearState }: WindowProps) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isQueryValid = useRecoilValue(isSearchQueryValidAtom);
  const searchQueryValid = useRecoilValue(searchQueryValidAtom);
  const uncommitted = useRecoilValue(searchStateUncommittedAtom);
  const loadable = useRecoilValueLoadable(searchResultsAtom);
  const isSearchable = type === 'search' || type === 'home';
  const addTextQueryNode = useAddTextQueryNode();
  const addAttributeQueryNode = useAddAttributeQueryNode();
  const prependCollectionQueryNode = usePrependCollectionQueryNode();
  const pushWindowHash = usePushWindowHash();

  const [suggestionTerm, setSuggestionTerm] = useRecoilState(
    searchSuggestionTermAtom
  );
  const debouncedSearchSuggestions = useDebounceCallback(
    setSuggestionTerm,
    500
  );
  const { suggestions, loading: suggestionsLoading } = useRecoilValue(
    searchSuggestionsAtom(state)
  );
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
        filterOptions={filterOnServer ? (x) => x : clientFilter}
        onOpen={() => setSearchOpen(true)}
        onClose={() => setSearchOpen(false)}
        onChange={(_evt, onChangeValue, reason) => {
          if (reason === 'clear') {
            return clearState();
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
            default: {
              const n: never = value.group;
              return n;
            }
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
            <SearchChips disabled={disabled} clearState={clearState} />
          ) : (
            <Chip
              size="small"
              label={`${type}: ${state}`}
              variant="outlined"
              onDelete={() => clearState()}
            />
          )
        }
        filterSelectedOptions={true}
        disabled={disabled}
        renderInput={(params) => (
          <TextFieldInput
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
