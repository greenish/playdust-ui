import { AccountPage } from '../../explorer/pages/AccountPage'
import { BlockPage } from '../../explorer/pages/BlockPage'
import { EpochPage } from '../../explorer/pages/EpochPage'
import { TxPage } from '../../explorer/pages/TxPage'
import Home from '../../home'
import Search from '../../search'
import WindowProps from '../types/WindowProps'

const WindowSwitch = (props: WindowProps) => {
  const key = props.state

  switch (props.type) {
    case 'home':
      return <Home />
    case 'search':
      return <Search {...props} />
    case 'account':
      return <AccountPage {...props} />
    case 'block':
      return <BlockPage {...props} />
    case 'tx':
      return <TxPage {...props} />
    case 'epoch':
      return <EpochPage {...props} />
    default:
      const n: never = props.type

      return n
  }
}

export default WindowSwitch
