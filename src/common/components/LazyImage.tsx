import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import { useInView } from 'react-intersection-observer'

type LazyImageProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

const LazyImage = (props: LazyImageProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  })

  return (
    <picture ref={ref} data-inview={inView} style={{ overflow: 'hidden' }}>
      {inView ? <img {...props} alt={props.alt || ''} /> : null}
    </picture>
  )
}

export default LazyImage
