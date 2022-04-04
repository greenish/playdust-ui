import styled from '@emotion/styled'
import FlagIcon from '@mui/icons-material/Flag'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { Suspense, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRecoilValue } from 'recoil'
import {
  getNFTCensorStatus,
  setNFTCensorStatus,
} from '../../helpers/auctionHouseApi'
import FlaggedModal from '../../src/search/components/FlaggedModal'
import * as store from '../../src/search/store'
import { userProfile } from '../../store'
import SearchMetadata from '../../types/SearchMetadata'
import Status from '../../types/Status'
import TradeNFT from './TradeNFT'

const ImageTradeContainer = styled.div`
  display: flex;
`

const ReportButton = styled(Button)`
  position: absolute;
  right: 24px;
`

const BlurImage = styled.img`
  filter: blur(1.5rem);
`

const BlurImageContainer = styled.div`
  overflow: hidden;
`

const CensoredContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`

const VisibilityContainer = styled.div`
  cursor: pointer;
  padding: 5px 8px;
  position: absolute;
  z-index: 10;
`

type CensorProps = {
  details: SearchMetadata
  mint: string
}

const Censor = ({ details, mint }: CensorProps) => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(Status.None)
  const [censorState, setCensorState] = useState(Status.None)
  const [visible, setVisible] = useState(false)
  const [cookies] = useCookies(['authToken'])
  const { roles } = useRecoilValue(userProfile)
  const { publicKey } = useWallet()
  const openFlaggedModal = store.useOpenFlaggedModal()

  useEffect(() => {
    getNFTCensorStatus(mint)
      .then((data) => {
        if (data.type === Status.Censored) {
          setStatus(Status.Censored)
        } else if (data.type === Status.NSFW) {
          setStatus(Status.NSFW)
        }
      })
      .catch((e) => {
        setStatus(Status.None)
      })
  }, [details])

  const saveStatus = () => {
    setNFTCensorStatus(mint, publicKey!.toBase58(), status)
    setStatus(censorState)
    setOpen(false)
  }

  return (
    <>
      <FlaggedModal />
      {cookies.authToken ? (
        <>
          {roles.length && roles.includes('admin') ? (
            <>
              <ReportButton
                onClick={() => setOpen(true)}
                color="primary"
                variant="outlined"
              >
                Change status
              </ReportButton>
              <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>Change item status</DialogTitle>
                <DialogContent>
                  <RadioGroup
                    value={censorState}
                    onChange={(e) => setCensorState(Number(e.target.value))}
                  >
                    <FormControlLabel
                      value={Status.None}
                      control={<Radio />}
                      label="None"
                    />
                    <FormControlLabel
                      value={Status.Censored}
                      control={<Radio />}
                      label="Censor"
                    />
                    <FormControlLabel
                      value={Status.NSFW}
                      control={<Radio />}
                      label="NFSW"
                    />
                  </RadioGroup>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={saveStatus}>Save</Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <ReportButton
              onClick={() => openFlaggedModal(mint, 'NFT')}
              color="error"
              variant="outlined"
              startIcon={<FlagIcon />}
            >
              Report
            </ReportButton>
          )}

          <ImageTradeContainer>
            <div>
              {status === Status.Censored || status === Status.NSFW ? (
                <BlurImageContainer>
                  {status === Status.NSFW ? (
                    <VisibilityContainer>
                      {visible ? (
                        <VisibilityOffIcon onClick={() => setVisible(false)} />
                      ) : (
                        <VisibilityIcon onClick={() => setVisible(true)} />
                      )}
                    </VisibilityContainer>
                  ) : null}
                  {visible ? (
                    <img
                      alt={details.data.name || ''}
                      src={details.offChainData.image}
                      height={500}
                    />
                  ) : (
                    <BlurImage
                      alt={details.data.name || ''}
                      src={details.offChainData.image}
                      height={500}
                    />
                  )}
                </BlurImageContainer>
              ) : (
                <img
                  alt={details.data.name || ''}
                  src={details.offChainData.image}
                  height={500}
                />
              )}
              <h1>{details.data.name}</h1>
            </div>
            {publicKey && (
              <>
                {status === Status.Censored ? (
                  <CensoredContainer>
                    <Typography color="error" variant="h5">
                      NFT censored
                    </Typography>
                    <Typography color="#757575">
                      Trading not available
                    </Typography>
                  </CensoredContainer>
                ) : (
                  <Suspense fallback={<CircularProgress />}>
                    <TradeNFT mint={mint} publicKey={publicKey} />
                  </Suspense>
                )}
              </>
            )}
          </ImageTradeContainer>
        </>
      ) : null}
    </>
  )
}

export default Censor
