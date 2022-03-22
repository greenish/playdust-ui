import qs from 'qs'

const parseOnlyListed = (input?: string) => {
  if (input === 'true') {
    return true
  }

  if (input === 'false') {
    return false
  }

  return undefined
}

export const parseHash = (): any => {
  try {
    const params = window.location.hash.slice(1)
    const parsed = qs.parse(params) as any
    const parsedQuery = Object.values(qs.parse(parsed.query)) as any[][]
    const result = {
      query: parsedQuery,
      sort: parsed.sort,
      onlyListed: parseOnlyListed(parsed.onlyListed),
    }

    return result
  } catch {
    return {}
  }
}

export const isHashEmpty = (): boolean => {
  const hash = qs.parse(window.location.hash.slice(1))

  return !('query' in hash)
}
