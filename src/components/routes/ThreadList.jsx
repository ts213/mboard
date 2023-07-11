import { PostList } from '../parts/PostList.jsx';
import { useState } from 'react';
import { PostFormsStateContainer } from '../posting/PostForm.jsx';
import { Link, useFetcher, useLoaderData } from 'react-router-dom';
import { useThreadsPagination } from '../../hooks/useThreadsPagination.jsx';
import { useThreadListEventHandler } from '../../hooks/useThreadListEventHandler.jsx';
import { routeLoaderHandler } from '../../utils/fetchHandler.js';
import { threadListCache } from '../../hooks/useThreadsPagination.jsx';
import i18n from '../../utils/translation.js';


export function ThreadList() {
  const { threads = [], pageNum, nextPageNum, board = '' } = useLoaderData();
  const [threadList, setThreadList] = useState(threads);
  document.title = board;

  const fetcher = useFetcher();
  const paginationIntersectionRef = useThreadsPagination(fetcher, nextPageNum, setThreadList);
  useThreadListEventHandler(setThreadList);

  return (
    <>
      {board !== 'all' && <PostFormsStateContainer toggleable={true} />}
      <CatalogButton />
      <PostList threadList={threadList} board={board} pageNum={pageNum} />
      <var style={{ visibility: 'hidden' }} ref={paginationIntersectionRef}>treeshold</var>
    </>
  );
}

export async function ThreadListLoader({ request, params }) {
  if (window.threadWasMounted && threadListCache.length) {
    window.threadWasMounted = false;
    return { threads: threadListCache, board: params.board };
  }

  const { pathname, search } = new URL(request.url);
  const url = '/api' + pathname + search;
  return await routeLoaderHandler(url);
}

function CatalogButton() {
  return (
    <>
      <hr style={{ borderColor: '#2e3847' }} />
      <Link to='catalog/' className='catalog-btn unstyled-btn'>
        {i18n.catalog}
      </Link>
      <hr style={{ borderColor: '#2e3847' }} />
    </>
  );
}
