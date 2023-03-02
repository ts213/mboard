// import { useOutletContext } from 'react-router-dom';

export function PostImage({ thumb, image, width, height, imageOnClickHandler }) {
  console.log('post image');
  return (
    <figure className='mr-4'>
      <a href={image} data-width={width} data-height={height}>
        <img src={thumb}
          onClick={imageOnClickHandler}
          className='img' alt='image'
        />
      </a>
    </figure>
  );
}
