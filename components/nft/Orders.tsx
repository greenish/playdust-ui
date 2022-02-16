import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { GetAllOrders } from '../../helpers/auctionHouseApi'
import { shortenPublicKey } from '../../helpers/utils'

const DataGridContainer = styled.div`
  height: 300px;
  width: 100%;
`

type OrderProps = {
  mint: string
}

const Orders = ({ mint }: OrderProps) => {
  const [rows, setRows] = useState<GridRowsProp>([])

  const columns: GridColDef[] = [
    {
      field: 'walletKey',
      headerName: 'Wallet',
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        shortenPublicKey(params.value),
    },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'side', headerName: 'Side', width: 150 },
    { field: 'qty', headerName: 'Quantity', width: 150 },
    {
      field: 'market',
      headerName: 'Market',
      width: 150,
      renderCell: (params: GridRenderCellParams) => params.value.tokenSymbol,
    },
  ]

  useEffect(() => {
    GetAllOrders(mint).then((data) => {
      setRows(data)
    })
  }, [])

  return (
    <Box mx={1}>
      <Typography gutterBottom variant="h6">
        Orders
      </Typography>
      <DataGridContainer>
        <DataGrid
          rows={rows!}
          columns={columns}
          getRowId={(row) => row.txHash}
        />
      </DataGridContainer>
    </Box>
  )
}

export default Orders
