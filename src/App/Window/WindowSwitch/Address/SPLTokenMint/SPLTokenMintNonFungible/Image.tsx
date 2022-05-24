import React, { useState } from 'react';
import styled from '@emotion/styled'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRecoilValue } from 'recoil';
import nftDetailsAtom from './_atoms/nftDetailsAtom';
import StatusEnumType from './_types/StatusEnumType';

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

const Image = () => {

  const nftDetails = useRecoilValue(nftDetailsAtom);

  if (!nftDetails.data.offChainData) {
    return null;
  }

  const details = nftDetails.data;

  // const [open, setOpen] = useState(false)
  // const [censorState, setCensorState] = useState(StatusEnumType.None)
  const [visible, setVisible] = useState(false)

  const { publicKey } = useWallet()

  return (
    <div>
      {status === StatusEnumType.Censored || status === StatusEnumType.NSFW ? (
        <BlurImageContainer>
          {status === StatusEnumType.NSFW ? (
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
