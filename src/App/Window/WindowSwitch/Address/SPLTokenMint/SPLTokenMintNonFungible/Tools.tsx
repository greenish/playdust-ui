import React from 'react';
import styled from '@emotion/styled'
import FlagIcon from '@mui/icons-material/Flag'
import { Button } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
/*
import { useCookies } from 'react-cookie'
import FlaggedModal from '../../../../../App/Window/WindowSwitch/Search/FlaggedModal'
import useOpenFlaggedModal from '../../../../../App/Window/WindowSwitch/Search/SearchOverview/CollectionOverview/_hooks/useOpenFlaggedModal'
import { useUserProfile } from '../../../../store'
 */

const ReportButton = styled(Button)``

function Tools() {
    /*
    const [cookies] = useCookies(['authToken'])
    const { roles } = useUserProfile()
    const openFlaggedModal = useOpenFlaggedModal()

    const hasAdminRole = roles.length && roles.includes('admin')

    return (
      <>
        <FlaggedModal />
        {cookies.authToken ? (
          <>
            {hasAdminRole ? (
              <></>
            ) : (
              <ReportButton
                onClick={() => openFlaggedModal(pubkey.toBase58(), 'NFT')}
                color="error"
                variant="outlined"
                startIcon={<FlagIcon />}
              >
                Report
              </ReportButton>
            )}
          </>
        ) : null}
      </>
    )
    */

    return <div>Tools</div>;
}

export default Tools;
