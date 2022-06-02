import styled from '@emotion/styled';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import playdustNftDataAtom from '../_atoms/playdustNftDataAtom';

const BlurImage = styled.img`
  filter: blur(1.5rem);
`;

const BlurImageContainer = styled.div`
  overflow: hidden;
`;

const VisibilityContainer = styled.div`
  cursor: pointer;
  padding: 5px 8px;
  position: absolute;
  z-index: 10;
`;

function NFTDetailsRenderMedia() {
  const playdustNftData = useRecoilValue(playdustNftDataAtom);
  const [visible, setVisible] = useState(false);

  if (!playdustNftData || !playdustNftData.metaplexOffChainData) {
    return null;
  }

  const offChainData = playdustNftData.metaplexOffChainData;

  const isNSFW = false;

  return (
    <div>
      {isNSFW ? (
        <BlurImageContainer>
          <VisibilityContainer>
            {visible ? (
              <VisibilityOffIcon onClick={() => setVisible(false)} />
            ) : (
              <VisibilityIcon onClick={() => setVisible(true)} />
            )}
          </VisibilityContainer>
          {visible ? (
            <img
              alt={offChainData.name || ''}
              src={offChainData.image}
              height={500}
            />
          ) : (
            <BlurImage
              alt={offChainData.name || ''}
              src={offChainData.image}
              height={500}
            />
          )}
        </BlurImageContainer>
      ) : (
        <img
          alt={offChainData.name || ''}
          src={offChainData.image}
          height={500}
        />
      )}
    </div>
  );
}

export default NFTDetailsRenderMedia;
