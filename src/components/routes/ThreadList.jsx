import { PostList } from '../parts/PostList.jsx';
import { useContext, useState } from 'react';
import { PostFormsStateContainer } from '../posting/PostForm.jsx';
import { Link, useFetcher, useLoaderData } from 'react-router-dom';
import { useThreadsPagination } from '../../hooks/useThreadsPagination.jsx';
import { useThreadListEventHandler } from '../../hooks/useThreadListEventHandler.jsx';
import { VITE_API_PREFIX } from '../../App.jsx';
import { threadListCache, useThreadListCache } from '../../hooks/useThreadListCache.jsx';
import { routeLoaderHandler } from '../../utils/fetchHandler.js';
import { page } from '../../hooks/useThreadsPagination.jsx';
import { TranslationContext } from '../parts/RoutesWrapper.jsx';

export function ThreadList() {
  const { threads = [], pageNum, nextPageNum, board = '' } = useLoaderData();
  const [threadList, setThreadList] = useState(threads);
  document.title = board;

  const fetcher = useFetcher();
  const paginationIntersectionRef = useThreadsPagination(fetcher, pageNum, nextPageNum, board);
  useThreadListEventHandler(setThreadList);
  useThreadListCache(fetcher, setThreadList, page);

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
  if (window.threadWasMounted && threadListCache.length && page.board === params.board) {
    window.threadWasMounted = false;
    return { threads: threadListCache, board: params.board };
  }

  let url = VITE_API_PREFIX + new URL(request.url).pathname;
  const pageNum = new URL(request.url).searchParams.get('page');
  if (pageNum) {
    url += `?page=${pageNum}`;
  }
  return await routeLoaderHandler(url);
}

function CatalogButton() {
  const i18n = useContext(TranslationContext);

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
