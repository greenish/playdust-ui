import React from 'react';
import { useRecoilValue } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import programLabel from '../../../_helpers/programLabel';
import safePubkeyString from '../../../_helpers/safePubkeyString';
import BasicInstructionCard from './BasicInstructionCard/BasicInstructionCard';
import InstructionCardPropsType from './_types/InstructionCardPropsType';

function UnknownInstructionDetailsCard(props: InstructionCardPropsType) {
  const { ix } = props;

  const { network } = useRecoilValue(solanaClusterAtom);

  const programId = safePubkeyString(ix.programId);
  const programName = programLabel(programId, network) || 'Unknown Program';

  const title = `${programName}: Unknown Instruction`;

  return <BasicInstructionCard {...props} title={title} defaultRaw={true} />;
}

export default UnknownInstructionDetailsCard;
