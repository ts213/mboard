export function PostImage({ thumb }) {
  return (
    <figure className='float-left'>
      <figcaption>image</figcaption>
      <a className='' href={thumb}>
        <img className=' mr-4' src={thumb} alt='' />
      </a>
    </figure>
  )
}
