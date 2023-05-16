import { useEffect } from 'react';

export function useThreadListEventHandler(setThreadList) {
  useEffect(() => {
    window.addEventListener('postDeleted', deletePostCallback);
    window.addEventListener('threadClosed', threadClosedCallback);

    function threadClosedCallback(ev) {
      const { postId: threadToClose, result } = ev.detail;
      setThreadList(threads =>
        threads.map(thread => {
          if (thread.id === threadToClose) {
            thread.closed = result ?? thread.closed;
          }
          return thread;
        })
      )
    }

    function deletePostCallback(ev) {
      const postIdToDelete = ev.detail?.postId;
      setThreadList(threads =>
        threads.filter(thread => {
          thread.replies = thread.replies.filter(reply => reply.id !== postIdToDelete);
          return thread.id !== postIdToDelete;
        })
      );
    }

    return () => {
      window.removeEventListener('postDeleted', deletePostCallback);
      window.removeEventListener('threadClosed', threadClosedCallback);
    };
  }, [setThreadList]);
}
