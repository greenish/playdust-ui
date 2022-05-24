import { Connection } from '@solana/web3.js'
import { programs } from '@metaplex/js'
import { selector } from 'recoil'
import SearchMetadata from '../../../../../../../../solana/SearchMetadataType';
import fetchOnchain from '../../../../../../../../solana/fetchOnchain';
import solanaClusterAtom from '../../../../../../_atoms/solanaClusterAtom';
import { getNFTCensorStatus } from '../_helpers/playdustApi';
import addressStateAtom from '../../../_atoms/addressStateAtom';
import frontendApi from '../../../../../_helpers/frontendApi';
import StatusEnumType from '../_types/StatusEnumType'

const Metadata = programs.metadata.Metadata

const nftDetailsAtom = selector<
  any // SearchMetadata | undefined
>({
  key: 'nftDetails',
  get: async ({ get }) => {
    try {

      const { endpoint } = get(solanaClusterAtom);
      const addressState = get(addressStateAtom);

      const { pubkey } = addressState;

      const connection = new Connection(endpoint)

      const metadata = await Metadata.load(
        connection,
        await Metadata.getPDA(pubkey)
      )

      console.log('metadata', metadata)

      let { data } = await frontendApi.get<SearchMetadata>(`/mint?address=${pubkey.toBase58()}`);

      console.log('data', data);

      if (!data) {
        data = await fetchOnchain.byMintAddress(endpoint, pubkey.toBase58());
      }

      console.log('data', data);

      let status;
      try {
        const { type } = await getNFTCensorStatus(pubkey.toBase58())
        status = type;
      } catch (err) {
        status = StatusEnumType.None;
      }

      return {
        data,
        status,
      };

    } catch (e) {

      console.error(e);
    }

    return null;
  },
})

export default nftDetailsAtom;
