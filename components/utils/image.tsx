import imageCDN from '../../helpers/imageCDN'

const Image = (props: any) => {
  return <img src={imageCDN(props.url, props.width, props.height)} {...props} />
}

export default Image
