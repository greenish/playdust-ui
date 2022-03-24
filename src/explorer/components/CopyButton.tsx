import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { IconButton } from '@mui/material'
import copy from 'copy-text-to-clipboard'

interface CopyButtonProps {
  value: string | number
}

export const CopyButton = ({ value }: CopyButtonProps) => {
  return (
    <IconButton onClick={(evt) => copy('' + value)} size="small">
      <ContentCopyIcon />
    </IconButton>
  )
}
