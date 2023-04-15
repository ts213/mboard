import { Outlet, ScrollRestoration } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { ImageOverlay } from './ImageOverlay';
import { useGlobalContextApi } from '../ContextProviders/GlobalContext.jsx';
import { usePostHistoryContextApi } from '../ContextProviders/PostHistoryContext.jsx';
import { addRepliesToPosts } from '../utils/addRepliesToPost.js';
import { useEffect } from 'react';
import { useDocumentTitle } from '../hooks/UseDocumentTitle.jsx';

export function Root() {
  useDocumentTitle();
  useEventListeners();
  return (
    <>
      <ScrollRestoration />
      <NavBar />
      <main>
        <Outlet />
      </main>
      <ImageOverlay />
    </>
  );
}

function useEventListeners() {
  const { onClick } = useGlobalContextApi();
  const onPostChange = usePostHistoryContextApi();

  useEffect(() => {
    addRepliesToPosts();
    document.body.addEventListener('click', onClick);
    window.addEventListener('postChange', onPostChange);

    return () => {
      document.body.removeEventListener('click', onClick);
      window.removeEventListener('postChange', onPostChange)
    };

  }, [onClick, onPostChange]);
}
