import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { fromProgramData } from '../helpers/securityTxt'
import { useAccountInfo } from '../store'
import { ExplorerCard } from './ExplorerCard'
import { ExplorerGrid } from './ExplorerGrid'
import { ExternalLink } from './ExternalLinks'

interface SecurityProps {
  pubkey: PublicKey
}

function isValidLink(value?: string) {
  if (!value) {
    return false
  }
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch (err) {
    return false
  }
}

function String({ value }: { value?: string }) {
  return <div>{value}</div>
}

function Contacts({ value }: { value?: string }) {
  return (
    <div>
      {value?.split(',').map((c, i) => {
        const idx = c.indexOf(':')
        if (idx < 0) {
          //invalid contact
          return <div key={i}>{c}</div>
        }
        const [type, information] = [c.slice(0, idx), c.slice(idx + 1)]
        return (
          <div key={i}>
            <Contact type={type} information={information} />
          </div>
        )
      })}
    </div>
  )
}

function AsURL({ value }: { value?: string }) {
  if (!value) {
    return null
  }

  if (isValidLink(value)) {
    return (
      <div>
        <ExternalLink url={value} />
      </div>
    )
  }
  return (
    <div>
      <pre>{value.trim()}</pre>
    </div>
  )
}

function Date({ value }: { value?: string }) {
  return <div>{value}</div>
}

function PGP({ value }: { value?: string }) {
  if (!value) {
    return null
  }

  if (isValidLink(value)) {
    return (
      <div>
        <ExternalLink url={value} />
      </div>
    )
  }
  return (
    <div>
      <code style={{ whiteSpace: 'pre-wrap' }}>{value.trim()}</code>
    </div>
  )
}

function Auditors({ value }: { value?: string }) {
  if (isValidLink(value)) {
    return (
      <div>
        <ExternalLink url={value} />
      </div>
    )
  }
  return (
    <div>
      {value?.split(',').map((c, idx) => {
        return <div key={idx}>{c}</div>
      })}
    </div>
  )
}

function Contact({ type, information }: { type: string; information: string }) {
  switch (type) {
    case 'discord':
      return <>Discord: {information}</>
    case 'email':
      return <ExternalLink url={`mailto:${information}`} label={information} />
    case 'telegram':
      return (
        <ExternalLink
          url={`https://t.me/${information}`}
          label={`Telegram: ${information}`}
        />
      )
    case 'twitter':
      return (
        <ExternalLink
          url={`https://twitter.com/${information}`}
          label={`Twitter ${information}`}
        />
      )
    case 'link':
      if (isValidLink(information)) {
        return <ExternalLink url={`${information}`} label={information} />
      }
      return <>{information}</>
    case 'other':
    default:
      return (
        <>
          {type}: {information}
        </>
      )
  }
}

export const SecurityContent = ({ pubkey }: SecurityProps) => {
  const account = useAccountInfo(pubkey)

  const programDataPubkey = (account?.data as ParsedAccountData)?.parsed?.info
    ?.programData

  const programAccount = useAccountInfo(
    programDataPubkey ? new PublicKey(programDataPubkey) : undefined
  )

  if (!programAccount) {
    return <div>An unknown error occurred</div>
  }

  const programData = (programAccount.data as ParsedAccountData).parsed.info

  const { securityTXT, error } = fromProgramData(programData)

  if (error) {
    return <div>{error}</div>
  }

  // Security.txt Note that this is self-reported by the author of the program and might not be accurate.

  const rows = [
    ['Name', <String value={securityTXT?.name} />],
    ['Project URL', <AsURL value={securityTXT?.project_url} />],
    ['Contacts', <Contacts value={securityTXT?.contacts} />],
    ['Policy', <AsURL value={securityTXT?.policy} />],
    [
      'Preferred Languages',
      <String value={securityTXT?.preferred_languages} />,
    ],
    ['Source Code URL', <AsURL value={securityTXT?.source_code} />],
    ['Secure Contact Encryption', <PGP value={securityTXT?.encryption} />],
    ['Auditors', <Auditors value={securityTXT?.auditors} />],
    ['Acknowledgements', <AsURL value={securityTXT?.acknowledgements} />],
    ['Expiry', <Date value={securityTXT?.expiry} />],
  ]

  return <ExplorerGrid rows={rows} />
}

export const Security = (props: SecurityProps) => {
  return (
    <ExplorerCard skeleton="table">
      <SecurityContent {...props} />
    </ExplorerCard>
  )
}
