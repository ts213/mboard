import { Outlet, ScrollRestoration, useParams } from 'react-router-dom';
import { ThreadsContext } from '../../context/ThreadsContext.jsx';
import { PostHistoryContext } from '../../context/PostHistoryContext.jsx';
import { Breadcrumbs } from './Breadcrumbs.jsx';
import { PostFormReducer } from '../posting/PostFormReducer.jsx';
import { useEffect } from 'react';
import { page } from '../../hooks/useThreadsPagination.jsx';
import { resetThreadListCache } from '../../hooks/useThreadsPagination.jsx';


export function ThreadsContainer() {
  const { threadId, board } = useParams();

  useEffect(() => {
    return () => {
      page.reset();
      resetThreadListCache();
    };
  }, [board]);

  return (
    <>
      <ScrollRestoration />
      <main className={threadId ? 'thread-route' : 'board-route'}>
        <Breadcrumbs />
        <ThreadsContext>
          <PostHistoryContext>
            <PostFormReducer>
              <Outlet />
            </PostFormReducer>
          </PostHistoryContext>
        </ThreadsContext>
      </main>
    </>
  );
}
