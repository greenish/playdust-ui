import { useEffect, useState } from 'react'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import * as store from '../store'

const useOnChangeSerializedSearch = (onChange: (nextState: string) => void) => {
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

export default useOnChangeSerializedSearch
