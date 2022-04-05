import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { encodeWindowSearch } from '../../app/helpers/getWindowUrl'
import * as store from '../store'

const useSyncSerializedSearchUrl = () => {
  const router = useRouter()
  const [didMount, setDidMount] = useState(false)
  const serializedSelected = useRecoilValue(store.searchSerializedSelected)
  const resetter = useResetRecoilState(store.searchResults)

  useEffect(() => {
    setDidMount(true)
  }, [])

  useEffect(() => {
    if (didMount) {
      router.push(
        encodeWindowSearch({ type: 'search', value: serializedSelected })
      )
      resetter()
    }
  }, [serializedSelected])
}

export default useSyncSerializedSearchUrl
