import { PostList } from '../parts/PostList.jsx';
import { useEffect, useState } from 'react';
import { PostFormsStateContainer } from '../posting/PostForm.jsx';
import { useFetcher, useLoaderData } from 'react-router-dom';
import { useThreadsPagination, page } from '../../hooks/useThreadsPagination.jsx';
import { useThreadListEventHandler } from '../../hooks/useThreadListEventHandler.jsx';
import { VITE_API_PREFIX } from '../../App.jsx';

let threadListCache = [];

export function ThreadList() {
  const { threads = [], pageNum, nextPageNum } = useLoaderData();
  const [threadList, setThreadList] = useState(threads);

  const fetcher = useFetcher();
  const paginationIntersectionRef = useThreadsPagination(fetcher, pageNum, nextPageNum);
  useThreadListEventHandler(setThreadList);
  useThreadListCache(fetcher, setThreadList);

  return (
    <>
      <PostFormsStateContainer toggleable={true} />
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

  let url = VITE_API_PREFIX + new URL(request.url).pathname;
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

function useThreadListCache(fetcher, setThreadList) {
  useEffect(() => {
    if (fetcher.data?.threads) {
      setThreadList(threads => {
        const withNewThreads = [...threads, ...fetcher.data.threads];
        threadListCache = withNewThreads;
        return withNewThreads;
      });
    }

    if (fetcher.data?.nextPageNum === null) {
      page.nextPageNum = false;
    }
  }, [fetcher.data?.threads, fetcher.data?.nextPageNum, setThreadList]);
}
