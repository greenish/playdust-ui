import React from 'react';
import { useRecoilValue } from 'recoil';
import connectedWalletAtom from '../../../../_atoms/connectedWalletAtom';
import TradeNFT from './TradeNFT/TradeNFT';
import addressStateAtom from '../_atoms/addressStateAtom';
import parsedTokenAccountAtom from '../_atoms/parsedTokenAccountAtom';
import safePubkeyString from '../_helpers/safePubkeyString';
import ContentContainer from '../_sharedComponents/ContentContainer';
import ExplorerAccordion from '../_sharedComponents/ExplorerAccordion';

// Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
function NFTTradingModule() {
  const addressState = useRecoilValue(addressStateAtom);
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const parsedTokenAccount = useRecoilValue(parsedTokenAccountAtom);

  if (
    !addressState ||
    !parsedTokenAccount ||
    parsedTokenAccount.type !== 'mint'
  ) {
    return null;
  }

  return (
    <ContentContainer>
      <ExplorerAccordion
        title="Trade"
        expanded={true}
        content={
          <TradeNFT
            mint={safePubkeyString(addressState.pubkey)}
            publicKey={connectedWallet}
          />
        }
      />
    </ContentContainer>
  );
}

export default NFTTradingModule;
