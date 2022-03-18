import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { pageIdx } from '../../src/explorer/store'

// Used to invalidate recoil caches
export const PageIndexer = () => {
  const router = useRouter()
  const setPageIdx = useSetRecoilState(pageIdx)

  useEffect(() => {
    const handleRouteChange = () => {
      setPageIdx((pageIdx) => pageIdx + 1)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return null
}
