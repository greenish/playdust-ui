import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Provider from '../provider'
import AppBar from '../src/app/components/AppBar'
import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  if (!router.isReady) {
    return <></>
  }

  return (
    <>
      <Head>
        <title>playdust</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☄</text></svg>"
        />
      </Head>
      <Provider>
        <AppBar>
          <Component {...pageProps} />
        </AppBar>
      </Provider>
    </>
  )
}

export default App
