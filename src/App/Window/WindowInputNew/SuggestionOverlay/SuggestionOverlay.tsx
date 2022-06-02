import styled from '@emotion/styled';
import {
  Box,
  Checkbox,
  CircularProgress,
  List,
  ListSubheader,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import parse from 'html-react-parser';
import React, { Suspense } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import attributeNodeDeltaAtom from '../_atoms/attributeNodeDeltaAtom';
import searchSuggestionsNewAtom from './_atoms/searchSuggestionsNewAtom';
import SearchSuggestionNewType from './_types/SearchSuggestionNewType';

const RootContainer = styled(Paper)`
  position: absolute;
  width: 100%;
`;

const groupSuggestions = (suggestions: SearchSuggestionNewType[]) => {
  const grouped = suggestions.reduce<{
    [group: string]: SearchSuggestionNewType[];
  }>((acc, curr) => {
    const current = acc[curr.group];
    const nextValue = current ? [...current, curr] : [curr];

    return {
      ...acc,
      [curr.group]: nextValue,
    };
  }, {});
  const entries = Object.entries(grouped).map(([key, value]) => ({
    group: key,
    suggestions: value.sort((a) => {
      if (a.selected) {
        return -1;
      }

      return 0;
    }),
  }));

  return entries;
};

function SuggestionOverlayContent() {
  const suggestions = useRecoilValue(searchSuggestionsNewAtom);
  const [delta, setDelta] = useRecoilState(attributeNodeDeltaAtom);
  const theme = useTheme();

  if (!suggestions) {
    return <i>No suggestions found....</i>;
  }

  return (
    <List
      sx={{
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        '& ul': { padding: 0 },
        maxHeight: window.innerHeight * 0.5,
      }}
      subheader={<li />}
    >
      {groupSuggestions(suggestions).map((suggestion) => (
        <li key={suggestion.group}>
          <ul>
            <ListSubheader>{suggestion.group}</ListSubheader>
            {suggestion.suggestions.map((entry) => {
              const found = delta.find((d) => d.key === entry.key);
              const disabled = Boolean(
                delta.length > 0 &&
                  delta[0].meta?.key !== entry.attributeMeta?.key
              );
              const isSelected = Boolean(
                (entry.selected && found?.add !== false) ||
                  (found && found.add === true)
              );

              return (
                <Typography
                  key={entry.key}
                  sx={{
                    paddingX: 3,
                    paddingY: 0.5,
                    fontSize: '80%',
                    color: disabled ? theme.palette.grey[500] : 'auto',
                    cursor: disabled ? 'auto' : 'pointer',
                    '&:hover': {
                      background: theme.palette.grey[100],
                    },
                  }}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }

                    if (found) {
                      return setDelta(delta.filter((d) => d.key !== entry.key));
                    }

                    setDelta([
                      ...delta,
                      {
                        add: !isSelected,
                        key: entry.key,
                        meta: entry.attributeMeta,
                      },
                    ]);
                  }}
                >
                  <Checkbox
                    size="small"
                    sx={{
                      padding: 0,
                      paddingRight: 1,
                      '&:hover': {
                        background: 'none',
                      },
                    }}
                    checked={isSelected}
                    disabled={disabled}
                  />
                  {parse(entry.label)}
                </Typography>
              );
            })}
          </ul>
        </li>
      ))}
    </List>
  );
}

function Loader() {
  return (
    <Box
      sx={{
        padding: 1,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={24} />
    </Box>
  );
}

function SuggestionOverlay() {
  return (
    <RootContainer elevation={8}>
      <Suspense fallback={<Loader />}>
        <SuggestionOverlayContent />
      </Suspense>
    </RootContainer>
  );
}

export default SuggestionOverlay;
