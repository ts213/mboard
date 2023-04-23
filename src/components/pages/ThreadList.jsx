import { PostList } from '../parts/PostList.jsx';
import { createContext, useEffect, useState } from 'react';
import { PostForm } from '../parts/PostForm.jsx';
import { useFetcher, useLoaderData } from 'react-router-dom';
import { useThreadsPagination, page } from '../../hooks/useThreadsPagination.jsx';

let threadListCache = [];
export const ThreadListContext = createContext();

export function ThreadList() {
  const { threads = [], pageNum, nextPageNum } = useLoaderData();
  const [threadList, setThreadList] = useState(threads);
  const fetcher = useFetcher();
  const paginationIntersectionRef = useThreadsPagination(fetcher, pageNum, nextPageNum);

  useEffect(() => {
    if (fetcher.data?.threads) {
      setThreadList(t => {
        const withNewThreads = [...t, ...fetcher.data.threads];
        threadListCache = withNewThreads;
        return withNewThreads;
      });
    }

    if (fetcher.data?.nextPageNum === null) {
      page.nextPageNum = false;
    }
  }, [fetcher.data?.threads, fetcher.data?.nextPageNum]);

  return (
    <>
      <ThreadListContext.Provider value={deletePostCallback}>
        <ToggleablePostForm />
        <PostList threadList={threadList} />
      </ThreadListContext.Provider>
      <var style={{ visibility: 'hidden' }} ref={paginationIntersectionRef}>treeshold</var>
    </>
  );

  function deletePostCallback(postIdToDelete) {
    const withoutDeletedPost = threads.filter(filterOutPost);

    setThreadList(withoutDeletedPost);

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
}

export async function ThreadListLoader({ request }) {
  if (window.threadWasMounted) {
    window.threadWasMounted = false;

    if (threadListCache.length > 0) {
      return { threads: threadListCache };
    }
  }

  let url = '/api' + new URL(request.url).pathname;
  const page = new URL(request.url).searchParams.get('page');
  if (page) {
    url += `?page=${page}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Response('loader error', { status: response.status });
  }
  return response.json();
}

function ToggleablePostForm() {
  return (
    <details>
      <summary>
        New Thread
      </summary>
      <PostForm />
    </details>
  )
}
