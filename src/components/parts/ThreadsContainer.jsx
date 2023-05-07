import { Outlet, ScrollRestoration } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext.jsx';
import { PostHistoryContext } from '../../context/PostHistoryContext.jsx';
import { Breadcrumbs } from './Breadcrumbs.jsx';

export function ThreadsContainer() {

  return (
    <>
      <ScrollRestoration />
      <main className='threads-wrap'>
        <Breadcrumbs />
        <GlobalContext>
          <PostHistoryContext>
            <Outlet />
          </PostHistoryContext>
        </GlobalContext>
      </main>
    </>
  );
}
