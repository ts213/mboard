import { useEffect } from 'react';

export function useOnPostDelete(setThreadList) {
  useEffect(() => {
    window.addEventListener('postDeleted', deletePostCallback);

    function deletePostCallback(ev) {
      const postIdToDelete = ev.detail?.postId;
      if (!postIdToDelete) {
        return;
      }

      setThreadList(threads => threads.filter(filterOutPost));

      function filterOutPost(post) {
        if (post.id === postIdToDelete) {
          return false; // no need to bother with replies if thread id matches
        }
        if (post.replies.find(reply => reply.id === postIdToDelete)) {
          post.replies = post.replies.filter(reply => reply.id !== postIdToDelete);
        }
        return true;
      }
    }

    return () => window.removeEventListener('postDeleted', deletePostCallback);
  }, [setThreadList]);
}
