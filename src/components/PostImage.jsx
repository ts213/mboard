import { useGlobalContextApi } from '../ContextProviders/GlobalContext.jsx';

export function PostImage({ thumb, image, width, height }) {
  const { onImageClick } = useGlobalContextApi();
  
  return (
    <figure style={{margin: '0 1rem 0 0'}}>
      <a href={image} data-width={width} data-height={height}>
        <img src={thumb}
          onClick={onImageClick}
          className='img' alt='image'
        />
      </a>
    </figure>
  );
}
