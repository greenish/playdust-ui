import { AccountPage } from '../../explorer/pages/AccountPage'
import { BlockPage } from '../../explorer/pages/BlockPage'
import { EpochPage } from '../../explorer/pages/EpochPage'
import { TxPage } from '../../explorer/pages/TxPage'
import Search from '../../search'
import WindowProps from '../types/WindowProps'
import Home from './Home'

const WindowSwitch = (props: WindowProps) => {
  const key = props.state

  switch (props.type) {
    case 'home':
      return <Home />
    case 'search':
      return <Search key={key} {...props} />
    case 'account':
      return <AccountPage key={key} {...props} />
    case 'block':
      return <BlockPage key={key} {...props} />
    case 'tx':
      return <TxPage key={key} {...props} />
    case 'epoch':
      return <EpochPage key={key} {...props} />
    default:
      const n: never = props.type

      return n
  }
}

export default WindowSwitch
