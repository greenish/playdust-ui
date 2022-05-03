import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import Link from 'next/link'

const RootContainer = styled.div`
  position: absolute;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100px;

  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`

interface BlurMoreProps {
  href?: string
  count: number
  height: number
}

const BlurMore = ({ href, count, height }: BlurMoreProps) => {
  if (count === 0) {
    return <></>
  }

  const text = <Typography>+{count.toLocaleString()}</Typography>

  return (
    <RootContainer style={{ height }}>
      {href ? <Link href={href}>{text}</Link> : text}
    </RootContainer>
  )
}

export default BlurMore
