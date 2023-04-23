import { createPortal } from 'react-dom';
import { useGlobalContextApi, useImageOverlayContext } from '../../context/GlobalContext.jsx';

export function ImageOverlay() {
  const imageOverlay = useImageOverlayContext();
  const { onImageClick } = useGlobalContextApi();

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
