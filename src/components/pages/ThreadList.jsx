import { PostList } from '../parts/PostList.jsx';
import { useEffect, useState } from 'react';
import { PostForm } from '../parts/PostForm.jsx';
import { useFetcher, useLoaderData } from 'react-router-dom';
import { useThreadsPagination, page } from '../../hooks/useThreadsPagination.jsx';
import { useOnPostDelete } from '../../hooks/useOnPostDelete.jsx';

let threadListCache = [];

export function ThreadList() {
  const { threads = [], pageNum, nextPageNum } = useLoaderData();
  const [threadList, setThreadList] = useState(threads);

  const fetcher = useFetcher();
  const paginationIntersectionRef = useThreadsPagination(fetcher, pageNum, nextPageNum);
  useOnPostDelete(setThreadList);

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
      <ToggleablePostForm />
      <PostList threadList={threadList} />
      <var style={{ visibility: 'hidden' }} ref={paginationIntersectionRef}>treeshold</var>
    </>
  );
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
