import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { useEffect, useLayoutEffect } from 'react';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';
import { useContextApi } from '../ContextProvider';
import { ImageOverlay } from './ImageOverlay';

export function RootLayout() {
  console.info('root l');
  const { onClick, onPostCreateOrDelete } = useContextApi();

  useLayoutEffect(() => {
    window.document.title = window.location.pathname;
  }, []);

  useEffect(() => {
    addRepliesToPosts();  // remove in return??
    document.body.addEventListener('mouseover', tooltipsOnHover);
    document.body.addEventListener('click', onClick);
    window.addEventListener('postChange', onPostCreateOrDelete);

    return () => {
      document.body.removeEventListener('mouseover', tooltipsOnHover);
      document.body.removeEventListener('click', onClick);
      window.removeEventListener('postChange', onPostCreateOrDelete)
    };

  }, [onClick, onPostCreateOrDelete]);

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
