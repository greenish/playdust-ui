import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { SignatureResult, TransactionInstruction } from '@solana/web3.js';
import React, { PropsWithChildren, useState } from 'react';
import { useRecoilValue } from 'recoil';
import LabeledAddressLink from '../../../../_sharedComponents/LabeledAddressLink/LabeledAddressLink';
import TransactionErrorDetailsType from '../../../_types/TransactionErrorDetailsType';
import InstructionCardPropsType from '../_types/InstructionCardPropsType';
import RawDetails from './RawDetails/RawDetails';
import RawParsedDetails from './RawParsedDetails';
import rawPopulatedTransactionAtom from './_atoms/rawPopulatedTransactionAtom';

function ixResult(
  result: SignatureResult,
  index: number
): ['warning' | 'error' | 'success', string?] {
  if (!result.err) {
    return ['success'];
  }

  if (typeof result.err === 'object' && 'InstructionError' in result.err) {
    const ixError = (result.err as TransactionErrorDetailsType)
      .InstructionError;
    if (ixError && Array.isArray(ixError)) {
      const [errorIndex, error] = ixError;
      if (Number.isInteger(errorIndex) && errorIndex === index) {
        return ['warning', `Error: ${JSON.stringify(error)}`];
      }
    }
  }

  return ['error'];
}

type BasicInstructionCardProps = InstructionCardPropsType & {
  title: string;
  defaultRaw?: boolean;
};

function BasicInstructionCard(
  props: PropsWithChildren<BasicInstructionCardProps>
) {
  const {
    title,
    defaultRaw,
    ix,
    result,
    index,
    innerCards,
    childIndex,
    children,
  } = props;

  const rawDetails = useRecoilValue(rawPopulatedTransactionAtom);

  const [showRaw, setShowRaw] = useState(defaultRaw || false);

  const rawClickHandler = () => setShowRaw((r) => !r);

  const [resultColor] = ixResult(result, index);

  const raw =
    rawDetails && childIndex === undefined
      ? rawDetails.transaction.instructions[index]
      : undefined;

  const label = `#${index + 1}${
    childIndex !== undefined ? `.${childIndex + 1}` : ''
  }`;

  return (
    <Box>
      <Typography variant="h6">
        <Chip label={label} color={resultColor} size="small" /> {title}
        <Button disabled={defaultRaw} onClick={rawClickHandler}>
          Raw
        </Button>
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {showRaw ? (
              <>
                <TableRow>
                  <TableCell>Program</TableCell>
                  <TableCell>
                    <LabeledAddressLink to={ix.programId} allowCopy={true} />
                  </TableCell>
                </TableRow>
                {'parsed' in ix ? (
                  <RawParsedDetails ix={ix}>
                    {raw ? <RawDetails ix={raw} /> : null}
                  </RawParsedDetails>
                ) : (
                  <RawDetails ix={ix as TransactionInstruction} />
                )}
              </>
            ) : (
              children
            )}

            {innerCards && innerCards.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  Inner Instructions
                  <Box p={3}>{innerCards}</Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default BasicInstructionCard;
