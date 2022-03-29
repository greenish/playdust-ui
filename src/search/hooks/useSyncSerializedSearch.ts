import { useEffect, useState } from 'react'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import * as store from '../store'

const useSyncSerializedSearch = (onChange: (nextState: string) => any) => {
  const [didMount, setDidMount] = useState(false)
  const serializedSelected = useRecoilValue(store.searchSerializedSelected)
  const resetter = useResetRecoilState(store.searchResults)

  useEffect(() => {
    setDidMount(true)
  }, [])

  useEffect(() => {
    if (didMount) {
      onChange(serializedSelected)
      resetter()
    }
  }, [serializedSelected])
}

export default useSyncSerializedSearch
