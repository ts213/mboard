import { useGlobalContextApi } from '../context/ThreadsContext.jsx';
import { usePostHistoryContextApi } from '../context/PostHistoryContext.jsx';
import { useEffect } from 'react';
import { addRepliesToPosts } from '../utils/utils.js';

export function useThreadEventListeners() {
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
