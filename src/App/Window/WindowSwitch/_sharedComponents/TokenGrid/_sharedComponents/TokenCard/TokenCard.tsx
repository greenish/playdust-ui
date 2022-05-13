import styled from '@emotion/styled';
import React from 'react';
import encodeWindowHash from '../../../../../../_helpers/encodeWindowHash';
import getCDNUrl from '../../../../../../_helpers/getCDNUrl';
import humanizeSolana from '../../../../_helpers/humanizeSolana';
import Link from '../../../Link';
import ImageCard from './ImageCard/ImageCard';
import SkeletonImageCard from './SkeletonImageCard';
import TokenCardFilter from './TokenCardFilter';
import type TokenCardProps from './_types/TokenCardProps';

const CardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const CardTextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-end;
`;

const CardText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardSecondaryContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  font-size: 90%;
  padding-bottom: 4px;
`;

const TokenCardFilterContainer = styled.div`
  margin-left: 8px;
`;

function TokenCard({
  imageSize,
  contentHeight,
  metadata,
  skeleton,
}: TokenCardProps) {
  const { image, name } = metadata?.offChainData || {};
  const href = encodeWindowHash({
    type: 'address',
    state: metadata?.mint || '',
  });
  const { lastListPrice, listed } = metadata || {};

  if (skeleton) {
    return (
      <SkeletonImageCard imageSize={imageSize} contentHeight={contentHeight} />
    );
  }

  return (
    <ImageCard
      imageSize={imageSize}
      src={image && getCDNUrl(image)}
      href={href}
      content={
        contentHeight ? (
          <CardContentContainer>
            <CardTextContainer>
              <CardText>
                <Link href={href}>{name || metadata?.data?.name}</Link>
              </CardText>
            </CardTextContainer>
            <CardSecondaryContainer>
              <span>
                {listed ? humanizeSolana(lastListPrice) : humanizeSolana()}
              </span>
              <TokenCardFilterContainer>
                {metadata && metadata.offChainData?.attributes && (
                  <TokenCardFilter metadata={metadata} />
                )}
              </TokenCardFilterContainer>
            </CardSecondaryContainer>
          </CardContentContainer>
        ) : null
      }
      contentHeight={contentHeight}
    />
  );
}

export default TokenCard;
