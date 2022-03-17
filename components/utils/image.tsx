import { useInView } from 'react-intersection-observer'
import imageCDN from '../../helpers/imageCDN'

const Image = (props: any) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  })

  return (
    <picture ref={ref} data-inview={inView}>
      {inView ? (
        <img src={imageCDN(props.url, props.width, props.height)} {...props} />
      ) : null}
    </picture>
  )
}

export default Image
