const imageCDN = (url: string, width: Number, height: Number) => {
  let path = `?url=${url}`
  if (width && height) {
    path = path.concat(`&d=${width}x${height}`)
  }
  return `/cdn/${path}`
}

export default imageCDN
