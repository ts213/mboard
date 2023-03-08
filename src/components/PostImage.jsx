import { useContextApi } from '../ContextProvider.jsx';

export function PostImage({ thumb, image, width, height }) {
  console.log('post image');
  const { onImageClick } = useContextApi();
  
  return (
    <figure className='mr-4'>
      <a href={image} data-width={width} data-height={height}>
        <img src={thumb}
          onClick={onImageClick}
          className='img' alt='image'
        />
      </a>
    </figure>
  );
}
