import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { ThreadsContainer } from './components/parts/ThreadsContainer.jsx';
import { createNewPostAction, editPostAction, deletePostAction } from './utils/formAction.js'
import { ErrorPage } from './components/pages/ErrorPage.jsx';
import { PostHistoryContext } from './context/PostHistoryContext.jsx';
import { GlobalContext } from './context/GlobalContext.jsx';
import { NavBarLayout } from './components/parts/NavBar.jsx';
import { BoardAction, BoardList, BoardLoader } from './components/pages/BoardList.jsx';
import { ThreadList } from './components/pages/ThreadList.jsx';
import { Thread, ThreadLoader } from './components/pages/Thread.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      ErrorBoundary={ErrorPage}
    >

      <Route path='/'
             id='boards'
             Component={BoardList}
             loader={BoardLoader}
             action={BoardAction}
             shouldRevalidate={() => false}
      />

      <Route Component={NavBarLayout}>
        <Route Component={ThreadsContainer}>
          <Route path=':board/'
                 id='board'
                 action={createNewPostAction}
                 Component={ThreadList}
                 loader={ThreadLoader}
                 shouldRevalidate={() => false}
          />
          <Route path=':board/thread/:threadId/'
                 id='thread'
                 action={createNewPostAction}
                 Component={Thread}
                 loader={ThreadLoader}
          />
        </Route>
      </Route>

      <Route path='post/:postId/' action={({ request }) => {
        if (request.method === 'PATCH') return editPostAction(request);
        if (request.method === 'DELETE') return deletePostAction(request);
      }}
      />

    </Route>
  )
);

export default function App() {
  return (
    <GlobalContext>
      <PostHistoryContext>
        <RouterProvider router={router} />
      </PostHistoryContext>
    </GlobalContext>
  );
}

export async function routeLoader(request) {
  let url = '/api' + new URL(request.url).pathname;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
