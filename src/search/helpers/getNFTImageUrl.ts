const getNFTImageUrl = (url: string, width: number, height: number) => {
  let path = `?url=${url}`
  if (width && height) {
    path = path.concat(`&d=${width}x${height}`)
  }
  return `/cdn/${path}`
}

export default getNFTImageUrl
