import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { ThreadsContainer } from './components/parts/ThreadsContainer.jsx';
import { newPostAction, deletePostAction, editPostAction } from './components/posting/formActions.js'
import { ErrorPage } from './components/routes/ErrorPage.jsx';
import { BoardAction, IndexPage, BoardLoader } from './components/routes/IndexPage.jsx';
import { ThreadList, ThreadListLoader } from './components/routes/ThreadList.jsx';
import { Thread, ThreadLoader } from './components/routes/Thread.jsx';
import { Catalog } from './components/routes/Catalog.jsx';
import { BoardList } from './components/routes/BoardList.jsx';
import { RoutesWrapper } from './components/parts/RoutesWrapper.jsx';

export default function App() {
  return <RouterProvider router={router} />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      Component={RoutesWrapper}
      ErrorBoundary={ErrorPage}
    >

      <Route path='/'
             id='indexPage'
             Component={IndexPage}
             loader={BoardLoader}
             action={BoardAction}
             shouldRevalidate={() => false}
      />

      <Route path='/boards'
             id='boards'
             Component={BoardList}
             loader={() => BoardLoader({ urlParams: 'fullList' })}
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
