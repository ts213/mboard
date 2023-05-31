import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import { ThreadsContainer } from './components/parts/ThreadsContainer.jsx';
import { newPostAction, deletePostAction, editPostAction } from './components/posting/formActions.js'
import { ErrorPage } from './components/routes/ErrorPage.jsx';
import { boardAction, BoardList, BoardLoader } from './components/routes/BoardList.jsx';
import { ThreadList, ThreadListLoader } from './components/routes/ThreadList.jsx';
import { Thread, ThreadLoader } from './components/routes/Thread.jsx';
import { useCurrentRoute } from './hooks/useCurrentRoute.jsx';
import { setDocumentTitle } from './utils/utils.js';
import { Catalog } from './components/routes/Catalog.jsx';

let { VITE_API_PREFIX, VITE_REPLIES_PER_PAGE } = import.meta.env;
VITE_REPLIES_PER_PAGE = Number(VITE_REPLIES_PER_PAGE);
export { VITE_API_PREFIX, VITE_REPLIES_PER_PAGE };

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
             action={boardAction}
             shouldRevalidate={() => false}
      />

      <Route Component={ThreadsContainer}>
        <Route path=':board/'
               id='board'
               action={newPostAction}
               Component={ThreadList}
               loader={ThreadListLoader}
               shouldRevalidate={() => false}
        />
        <Route path=':board/thread/:threadId/'
               id='thread'
               action={({ request, params }) => {
                 if (request.method === 'POST') return newPostAction({ request, params });
                 else if (request.method === 'PATCH') return editPostAction(request);
                 else if (request.method === 'DELETE') return deletePostAction(request);
               }}
               Component={Thread}
               loader={ThreadLoader}
               shouldRevalidate={({ actionResult }) => {
                 return actionResult ?
                   !Object.hasOwn(actionResult, 'errors')
                   : true;
               }}
        />
      </Route>

      <Route path=':board/catalog/'
             Component={Catalog}
             loader={ThreadListLoader}
      />

      <Route path='boards' Component={ErrorPage} />

    </Route>
  )
);
