import { Chip, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { Message, ParsedMessage, PublicKey } from '@solana/web3.js';
import React from 'react';
import { useRecoilValue } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import programLabel from '../../_helpers/programLabel';
import ExplorerAccordion from '../../_sharedComponents/ExplorerAccordion';
import rawTransactionInfoAtom from '../_atoms/rawTransactionInfoAtom';
import prettyProgramLogs from './_helpers/prettyProgramLogs';
import InstructionLogsType from './_types/InstructionLogsType';
import LogMessageType from './_types/LogMessageType';

interface ProgramNameProps {
  programId: PublicKey;
}

function ProgramName({ programId }: ProgramNameProps) {
  const { network } = useRecoilValue(solanaClusterAtom);

  let programName;

  try {
    programName = programLabel(programId.toBase58(), network);
  } catch (err) {}

  programName = programName || 'Unknown Program';

  return <>{programName}</>;
}

interface ProgramLogsCardProps {
  message: Message | ParsedMessage;
  logs: InstructionLogsType[];
}

function ProgramLogsCard({ message, logs }: ProgramLogsCardProps) {
  return (
    <Table>
      <TableBody>
        {message.instructions.map((ix, index) => {
          let programId;
          if ('programIdIndex' in ix) {
            const programAccount = message.accountKeys[ix.programIdIndex];
            if ('pubkey' in programAccount) {
              programId = programAccount.pubkey;
            } else {
              programId = programAccount;
            }
          } else {
            programId = ix.programId;
          }
          const programLogs: InstructionLogsType | undefined = logs[index];

          let badgeColor = 'white';
          if (programLogs) {
            badgeColor = programLogs.failed ? 'warning' : 'success';
          }

          return (
            <TableRow key={index}>
              <TableCell>
                <div>
                  <Chip label={`#${index + 1}`} color="success" size="small" />{' '}
                  <ProgramName programId={programId} /> Instruction
                </div>
                {programLogs && (
                  <div>
                    {programLogs.logs.map((log: LogMessageType, key: number) => {
                      return (
                        <div key={key}>
                          <span className="text-muted">{log.prefix}</span>
                          <span className={`text-${log.style}`}>
                            {log.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function ProgramLog() {
  const { network } = useRecoilValue(solanaClusterAtom);
  const tx = useRecoilValue(rawTransactionInfoAtom);

  if (!tx) {
    return <div>No data available</div>;
  }

  const {
    meta,
    transaction: { message },
  } = tx;

  const { logMessages, err } = meta || {};

  const prettyLogs = prettyProgramLogs(logMessages || [], err || null, network);

  return (
    <ExplorerAccordion
      id="program-log"
      title="Program Log"
      expanded={true}
      content={
        prettyLogs !== null ? (
          <ProgramLogsCard message={message} logs={prettyLogs} />
        ) : (
          <div>Logs not supported for this transaction</div>
        )
      }
    />
  );
}

export default ProgramLog;
