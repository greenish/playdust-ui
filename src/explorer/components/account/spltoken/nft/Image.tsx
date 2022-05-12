import styled from '@emotion/styled'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import Status from '../../../../../App/_types/StatusEnumType'
import SearchMetadata from '../../../../../../solana/SearchMetadataType'

const BlurImage = styled.img`
  filter: blur(1.5rem);
`

const BlurImageContainer = styled.div`
  overflow: hidden;
`

const VisibilityContainer = styled.div`
  cursor: pointer;
  padding: 5px 8px;
  position: absolute;
  z-index: 10;
`

type ImageProps = {
  details: SearchMetadata
  mint: string
  status: Status
}

export const Image = ({ details, mint, status }: ImageProps) => {
  const [open, setOpen] = useState(false)
  const [censorState, setCensorState] = useState(Status.None)
  const [visible, setVisible] = useState(false)

  const { publicKey } = useWallet()

  return (
    <div>
      {status === Status.Censored || status === Status.NSFW ? (
        <BlurImageContainer>
          {status === Status.NSFW ? (
            <VisibilityContainer>
              {visible ? (
                <VisibilityOffIcon onClick={() => setVisible(false)} />
              ) : (
                <VisibilityIcon onClick={() => setVisible(true)} />
              )}
            </VisibilityContainer>
          ) : null}
          {visible ? (
            <img
              alt={details.data.name || ''}
              src={details.offChainData.image}
              height={500}
            />
          ) : (
            <BlurImage
              alt={details.data.name || ''}
              src={details.offChainData.image}
              height={500}
            />
          )}
        </BlurImageContainer>
      ) : (
        <img
          alt={details.data.name || ''}
          src={details.offChainData.image}
          height={500}
        />
      )}
    </div>
  )
}

export default Image
