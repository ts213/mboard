export function PostImage({ thumb, image, width, height, idx }) {
  return (
    <figure>
      {/*<figcaption>image</figcaption>*/}
      <a href={image} data-width={width} data-height={height}>
        <img data-num={idx} className='img-thumb mr-4' src={thumb} alt='' />
      </a>
    </figure>
  )
}
