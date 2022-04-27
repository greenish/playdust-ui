import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

type ImgProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

const Playdust = (props: ImgProps) => (
  <img alt="playdust-icon" src="/playdust-light.svg" {...props} />
)

export default Playdust
