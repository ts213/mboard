import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useEffect } from 'react';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';
import { useContextApi } from '../ContextProvider';
import { ImageOverlay } from './ImageOverlay';

export function RootLayout() {
  console.info('root l');
  const { onClick } = useContextApi();

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
      <ImageOverlay />
    </>
  );
}
