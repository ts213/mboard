import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useEffect } from 'react';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';
import { useContextApi, useImageOverlay } from '../ContextProvider';

export function RootLayout() {
  console.info('root l');
  const { onImageClick, onClick } = useContextApi();
  const imageOverlay = useImageOverlay();

  useEffect(() => {
    addRepliesToPosts();
    document.body.addEventListener('mouseover', tooltipsOnHover);
    document.body.addEventListener('click', onClick);

    return () => {
      document.body.removeEventListener('mouseover', tooltipsOnHover);
      document.body.removeEventListener('click', onClick);
    };

  }, [onClick]);


  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      {imageOverlay.expanded && <ExpandedImage />}
    </>
  );

  function ExpandedImage() {
    return (
      <div id='img-wrapper'>
        <a href={imageOverlay.imageUrl} className=''>
          <img id='expanded-img' className='img' alt='image'
            onClick={onImageClick}
            src={imageOverlay.imageUrl} />
        </a>
      </div>
    );
  }
}
