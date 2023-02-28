export function PostImage({ thumb, image, width, height, lovilka }) {
  return (
    <figure className='mr-4'>
      <a href={image} data-width={width} data-height={height}>
        <img src={thumb}
          onClick={lovilka}
          className='img' alt='image'
        />
      </a>
    </figure>
  );
}
