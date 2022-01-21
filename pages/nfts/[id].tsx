import { useRouter } from 'next/router'

import TradingModule from '../../components/TradingModule'

const Nft = () => {
  const router = useRouter()

  return (
    <>
      <TradingModule id={String(router.query.id)} />
    </>
  )
}

export default Nft
