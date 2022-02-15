import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import { grey } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { PropsWithChildren } from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: grey[800],
    },
  },
})

const ThemeProvider = ({ children }: PropsWithChildren<{}>) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
)

export default ThemeProvider
