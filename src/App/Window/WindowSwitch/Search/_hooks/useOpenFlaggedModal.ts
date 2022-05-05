import { useSetRecoilState } from 'recoil';
import flaggedCollection from '../_atoms/flaggedCollection';

const useOpenFlaggedModal = () => {
  const setter = useSetRecoilState(flaggedCollection);

  return (id: string, type: 'Collection' | 'NFT') => {
    setter({
      id,
      type,
      open: true,
    });
  };
};

export default useOpenFlaggedModal;
