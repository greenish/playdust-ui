import { selector } from 'recoil';
import connectedWalletAtom from '../../../../../_atoms/connectedWalletAtom';
import addressStateAtom from '../../_atoms/addressStateAtom';
import safePubkeyString from '../../_helpers/safePubkeyString';
import tokenAccountsForWalletAtom from './tokenAccountsForWalletAtom';

const isWalletMintOwnerAtom = selector<boolean>({
  key: 'isWalletMintOwnerAtom',
  get: ({ get }) => {
    const connectedWallet = get(connectedWalletAtom);
    const ownedTokens = get(tokenAccountsForWalletAtom);
    const addressState = get(addressStateAtom);

    if (!addressState || !connectedWallet) {
      return false;
    }

    const mint = safePubkeyString(addressState.pubkey);

    return !!ownedTokens.find(
      (entry) =>
        entry.data.info.mint === mint &&
        entry.data.info.tokenAmount.uiAmount > 0
    );
  },
});

export default isWalletMintOwnerAtom;
