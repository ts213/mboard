import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root.jsx';
import { createNewPostAction, editPostAction, deletePostAction } from './utils/formAction.js'
import { ErrorPage } from './components/routes/ErrorPage.jsx';
import { PostHistoryContext } from './ContextProviders/PostHistoryContext.jsx';
import { ThreadListLoader } from './components/routes/ThreadList.jsx';
import { GlobalContext } from './ContextProviders/GlobalContext.jsx';
import { Feed, FeedLoader } from './components/routes/Feed.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'
           Component={Root}
           ErrorBoundary={ErrorPage}
    >

      <Route index Component={HomePage} />

      <Route path='boards/'
             id='boards'
             lazy={async () => {
               const { BoardList, boardLoader } = await import('./components/routes/BoardList.jsx');
               return { Component: BoardList, loader: boardLoader };
             }}
      />

      <Route path=':board/'
             id='board'
             action={createNewPostAction}
             lazy={async () => {
               const { ThreadList } = await import('./components/routes/ThreadList.jsx');
               return { Component: ThreadList, loader: ThreadListLoader };
             }}
             shouldRevalidate={() => false}
      />

      <Route path=':board/thread/:threadId/'
             id='thread'
             action={createNewPostAction}

             lazy={async () => {
               const { Thread, ThreadLoader } = await import('./components/routes/Thread.jsx');
               return { Component: Thread, loader: ThreadLoader };
             }}
      />

      <Route path='edit/' action={editPostAction} />
      <Route path='delete/:postId/' action={deletePostAction} />

      <Route path='feed/'
             Component={Feed}
             loader={FeedLoader} />

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

function HomePage() {
  return (
    <div>home page.....</div>
  )
}

export async function routeLoader(request) {
  let url = '/api' + new URL(request.url).pathname;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
