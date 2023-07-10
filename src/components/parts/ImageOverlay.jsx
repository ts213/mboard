import { createPortal } from 'react-dom';
import { useImageOverlayContext } from '../../context/ThreadsContext.jsx';

export function ImageOverlay({ onClick }) {
  const imageOverlay = useImageOverlayContext();

  return (
    imageOverlay.expanded &&
    createPortal(
      <div id='img-wrapper'>
        <a href={imageOverlay.imageUrl}>
          <img id='expanded-img' className='img' alt='image'
               onClick={onClick}
               src={imageOverlay.imageUrl}
          />
        </a>
      </div>
      , document.body
    )
  );
}
