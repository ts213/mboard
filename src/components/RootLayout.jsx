import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { ImageOverlay } from './ImageOverlay';
import { GlobalContext, useGlobalContextApi } from '../ContextProviders/GlobalContext.jsx';
import { usePostHistoryContextApi } from '../ContextProviders/PostHistoryContext.jsx';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { tooltipsOnHover } from '../utils/tooltipsOnHover.js';
import { useEffect, useLayoutEffect } from 'react';

export function RootLayout() {
  return (
    <>
      <NavBar />
      <GlobalContext>
        <main>
          <Outlet />
        </main>
        <ImageOverlay />
        <EventListeners />
      </GlobalContext>
    </>
  );
}

function EventListeners() {
  const { onClick } = useGlobalContextApi();
  const onPostChange = usePostHistoryContextApi();

  useLayoutEffect(() => {
    window.document.title = window.location.pathname;
  }, []);

  useEffect(() => {
    addRepliesToPosts();  // remove in return??
    document.body.addEventListener('mouseover', tooltipsOnHover);
    document.body.addEventListener('click', onClick);
    window.addEventListener('postChange', onPostChange);

    return () => {
      document.body.removeEventListener('mouseover', tooltipsOnHover);
      document.body.removeEventListener('click', onClick);
      window.removeEventListener('postChange', onPostChange)
    };

  }, [onClick, onPostChange]);
}
