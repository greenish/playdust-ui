import {
  Box,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import ImageButton from '../../../_sharedComponents/ImageButton';
import SuspenseBoundary from '../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import setWindowImagesAtom from '../../_atoms/setWindowImagesAtom';
import PlaydustLogo from '../../_sharedComponents/PlaydustLogo';
import humanizeCollection from '../_helpers/humanizeCollection';
import humanizeSolana from '../_helpers/humanizeSolana';
import useAddCollectionQueryNode from '../_hooks/useAddCollectionQueryNode';
import Link from '../_sharedComponents/Link';
import WindowInput from '../_sharedComponents/WindowInput/WindowInput';
import topCollectionsAtom from './_atoms/topCollectionsAtom';

function Home() {
  const topCollectionsLoadable = useRecoilValueLoadable(topCollectionsAtom);
  const addCollectionQuery = useAddCollectionQueryNode('href');
  const hasValue = topCollectionsLoadable.state === 'hasValue';
  const setWindowImages = useRecoilValue(setWindowImagesAtom);

  useEffect(() => {
    if (setWindowImages) setWindowImages([]);
  }, [setWindowImages]);

  const grouped = useMemo(() => {
    if (hasValue) {
      const { results } = topCollectionsLoadable.contents;

      return results.slice(0, 7).map(({ collection, nfts }) => ({
        key: collection.id,
        groupLabel: humanizeCollection(collection),
        groupSecondary: humanizeSolana(collection.volume.global.total),
        groupHref: addCollectionQuery(collection.id),
        groupTotal: collection.elementCount,
        nfts,
      }));
    }

    return [];
  }, [hasValue, addCollectionQuery, topCollectionsLoadable.contents]);

  const content = (
    <Table sx={{ backgroundColor: 'background.default' }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: '#9ba6b1', borderBottom: '0px' }}>
            TOP COLLECTIONS
          </TableCell>
          <TableCell
            align="right"
            sx={{ color: '#9ba6b1', borderBottom: '0px' }}
          >
            VOLUME
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {grouped.map(({ key, groupHref, groupLabel, groupSecondary, nfts }) => {
          const image = <ImageButton size={40} images={[nfts[0]?.image]} />;

          return (
            <TableRow key={key}>
              <TableCell sx={{ fontWeight: 600, borderBottom: '0px' }}>
                <Grid container={true} alignItems="center" spacing={1}>
                  <Grid item={true}>
                    <Link href={groupHref}>{image}</Link>
                  </Grid>
                  <Grid item={true}>
                    <Link href={groupHref}>{groupLabel}</Link>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: '0px' }}>
                {groupSecondary}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
        <Box>
          <PlaydustLogo width="143px" />
        </Box>
        <Typography variant="body1" marginBottom="6%">
          Everything to know about NFTs on Solana
        </Typography>
        <Box marginBottom="8%">
          <SuspenseBoundary
            loading={null}
            error={null}
            content={<WindowInput />}
          />
        </Box>
        <Box minWidth="75%" alignSelf="center" justifySelf="center">
          <SuspenseBoundary
            loading={<CircularProgress />}
            error={null}
            content={content}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
