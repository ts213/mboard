import { Outlet, ScrollRestoration } from 'react-router-dom';
import { ImageOverlay } from './ImageOverlay.jsx';
import { useGlobalContextApi } from '../../context/GlobalContext.jsx';
import { usePostHistoryContextApi } from '../../context/PostHistoryContext.jsx';
import { addRepliesToPosts } from '../../utils/addRepliesToPost.js';
import { useEffect } from 'react';
import { useDocumentTitle } from '../../hooks/UseDocumentTitle.jsx';

export function ThreadsContainer() {
  useDocumentTitle();
  useEventListeners();
  return (
    <>
      <ScrollRestoration />
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
