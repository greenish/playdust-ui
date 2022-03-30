import { atom, useSetRecoilState } from 'recoil'

interface FlaggedType {
  id: string
  type: 'Collection' | 'NFT' | undefined
  open: boolean
}

export const flagged = atom<FlaggedType>({
  key: 'flagged',
  default: {
    open: false,
    id: '',
    type: undefined,
  },
})

export const useOpenFlaggedModal = () => {
  const setter = useSetRecoilState(flagged)

  return (id: string, type: 'Collection' | 'NFT') => {
    setter({
      id,
      type,
      open: true,
    })
  }
}
