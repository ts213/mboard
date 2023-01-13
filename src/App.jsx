import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { ThreadsList, dataLoader } from './components/ThreadsList.jsx';
import RootLayout from './components/RootLayout.jsx';
import { BoardsList, boardsLoader } from './components/BoardsList.jsx';
import { ErrorCpmnt } from './components/ErrorCpmnt.jsx';
import { Thread, threadLoader } from './components/Thread';
import { formAction } from './components/PostForm.jsx';


export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />} errorElement={<ErrorCpmnt />}>
        <Route index element={<HomePage />} />
        <Route path='boards' loader={boardsLoader} element={<BoardsList />} />
        <Route path=':board' loader={dataLoader} element={<ThreadsList />} />
        <Route path=':board/thread/:threadId' loader={threadLoader} action={formAction} element={<Thread />} />
      </Route>
    )
  );
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

function HomePage() {
  return (
    <div className={'text-center m-20'}>home page.....</div>
  )
}

