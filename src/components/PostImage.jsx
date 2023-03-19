import { useGlobalContextApi } from '../ContextProviders/GlobalContext.jsx';

export function PostImage({ thumb, image, width, height }) {
  const { onImageClick } = useGlobalContextApi();
  
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
