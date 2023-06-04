import { PostList } from '../parts/PostList.jsx';
import { useState } from 'react';
import { PostFormsStateContainer } from '../posting/PostForm.jsx';
import { Link, useFetcher, useLoaderData } from 'react-router-dom';
import { useThreadsPagination } from '../../hooks/useThreadsPagination.jsx';
import { useThreadListEventHandler } from '../../hooks/useThreadListEventHandler.jsx';
import { VITE_API_PREFIX } from '../../App.jsx';
import { threadListCache, useThreadListCache } from '../../hooks/useThreadListCache.jsx';
import { routeLoaderHandler } from '../../utils/fetchHandler.js';

export function ThreadList() {
  const { threads = [], pageNum, nextPageNum, board = '' } = useLoaderData();
  const [threadList, setThreadList] = useState(threads);
  document.title = board;

  const fetcher = useFetcher();
  const paginationIntersectionRef = useThreadsPagination(fetcher, pageNum, nextPageNum);
  useThreadListEventHandler(setThreadList);
  useThreadListCache(fetcher, setThreadList);

  return (
    <>
      {board !== 'all' && <PostFormsStateContainer toggleable={true} />}
      <CatalogButton />
      <PostList threadList={threadList} board={board} />
      <var style={{ visibility: 'hidden' }} ref={paginationIntersectionRef}>treeshold</var>
    </>
  );
}

export async function threadListLoader({ request, params }) {
  if (window.threadWasMounted && threadListCache.length > 0) {
    window.threadWasMounted = false;
    return { threads: threadListCache, board: params.board };
  }

  let url = VITE_API_PREFIX + new URL(request.url).pathname;
  const page = new URL(request.url).searchParams.get('page');
  if (page) {
    url += `?page=${page}`;
  }
  return await routeLoaderHandler(url);
}

function CatalogButton() {
  return (
    <>
      <hr style={{ borderColor: '#2e3847' }} />
      <Link to='catalog/' className='catalog-btn unstyled-btn'>
        Catalog
      </Link>
      <hr style={{ borderColor: '#2e3847' }} />
    </>
  )
}
