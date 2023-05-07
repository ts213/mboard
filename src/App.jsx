import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import { ThreadsContainer } from './components/parts/ThreadsContainer.jsx';
import { createNewPostAction, deletePostAction, editPostAction } from './utils/formAction.js'
import { ErrorPage } from './components/pages/ErrorPage.jsx';
import { BoardAction, BoardList, BoardLoader } from './components/pages/BoardList.jsx';
import { ThreadList, ThreadListLoader } from './components/pages/ThreadList.jsx';
import { Thread, ThreadLoader } from './components/pages/Thread.jsx';
import { useCurrentRoute } from './hooks/useCurrentRoute.jsx';
import { setDocumentTitle } from './utils/setDocumentTitle.js';

export default function App() {
  return <RouterProvider router={router} />
}

function Title() {
  const route = useCurrentRoute();
  setDocumentTitle(route);
  return <Outlet />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      ErrorBoundary={ErrorPage}
      Component={Title}
    >

      <Route path='/'
             id='boards'
             Component={BoardList}
             loader={BoardLoader}
             action={BoardAction}
             shouldRevalidate={() => false}
      />

      {/*<Route Component={NavBarLayout}>*/}
      <Route Component={ThreadsContainer}>
        <Route path=':board/'
               id='board'
               action={createNewPostAction}
               Component={ThreadList}
               loader={ThreadListLoader}
               shouldRevalidate={() => false}
        />
        <Route path=':board/thread/:threadId/'
               id='thread'
               action={createNewPostAction}
               Component={Thread}
               loader={ThreadLoader}
        />
      </Route>
      {/*</Route>*/}

      <Route path='post/:postId/' action={({ request }) => {
        if (request.method === 'PATCH') return editPostAction(request);
        if (request.method === 'DELETE') return deletePostAction(request);
      }}
      />

    </Route>
  )
);

export async function routeLoader(request) {
  let url = '/api' + new URL(request.url).pathname;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
