import { useContextApi, useImageOverlayContext } from '../ContextProvider.jsx';
import { createPortal } from 'react-dom';

export function ImageOverlay() {
  const imageOverlay = useImageOverlayContext();
  const { onImageClick } = useContextApi();

  return (
    imageOverlay.expanded &&
    createPortal(
      <div id='img-wrapper'>
        <a href={imageOverlay.imageUrl}>
          <img id='expanded-img' className='img' alt='image'
               onClick={onImageClick}
               src={imageOverlay.imageUrl}
          />
        </a>
      </div>
      , document.body
    )
  );
}
