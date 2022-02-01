const imageCDN = (url: string) => {
  const path = url.substring(url.lastIndexOf('/') + 1, url.length)
  return `/cdn/${path}`
}

export default imageCDN
