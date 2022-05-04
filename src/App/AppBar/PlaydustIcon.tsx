import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

type ImgProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

const PlaydustIcon = (props: ImgProps) => (
  <img alt="playdust-icon" src="/playdust-light.svg" {...props} />
)

export default PlaydustIcon
