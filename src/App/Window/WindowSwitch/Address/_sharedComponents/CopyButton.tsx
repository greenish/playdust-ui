import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@mui/material';
import copy from 'copy-text-to-clipboard';
import React from 'react';

interface CopyButtonProps {
  value: string | number;
}

function CopyButton({ value }: CopyButtonProps) {
  return (
    <IconButton onClick={() => copy(String(value))}>
      <ContentCopyIcon />
    </IconButton>
  );
}

export default CopyButton;
