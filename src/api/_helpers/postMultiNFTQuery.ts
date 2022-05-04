import type OpenSearchNFTSourceType from '../../_types/OpenSearchNFTSourceType'
import makePostMultiQuery from './makePostMultiQuery'

const postMultiNFTQuery = makePostMultiQuery<OpenSearchNFTSourceType>()

export default postMultiNFTQuery
