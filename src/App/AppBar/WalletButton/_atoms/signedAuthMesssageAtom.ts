import { atom } from 'recoil';

interface SignedAuthMessage {
  nonce: string;
  message: string;
}

const signedAuthMesssageAtom = atom<SignedAuthMessage | null>({
  key: 'signedAuthMesssageAtom',
  default: null,
});

export default signedAuthMesssageAtom;
