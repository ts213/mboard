export function PostImage({ thumb, image }) {
  return (
    <figure>
      {/*<figcaption>image</figcaption>*/}
      <a className='' href={image}>
        <img className=' mr-4' src={thumb} alt='' />
      </a>
    </figure>
  )
}
