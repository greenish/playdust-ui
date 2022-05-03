export const cdnImageSize = 300

const getCDNUrl = (original: string) =>
  `/cdn/?url=${original}&d=${cdnImageSize}x${cdnImageSize}`

export default getCDNUrl
