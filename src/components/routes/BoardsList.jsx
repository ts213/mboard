import { useLoaderData, Await } from 'react-router-dom';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';

export default function BoardsList() {
  const boardsData = useLoaderData();

  return (
    <Suspense fallback={<h1 className='ml-12 mb-5 text-lg text-center'>loading</h1>}>
      <Await resolve={boardsData.boards}>
        {(loaded) => mapEmAll(loaded)}
      </Await>
    </Suspense>
  )
}

function mapEmAll(obj) {
  return obj.map(board =>
    <div key={board.link} className='ml-12 mb-5 text-lg text-center'>
      <Link to={'../' + board.link + '/'}>{board.title}</Link>
      <hr className='h-px my-8 border-0 dark:bg-gray-700' />
    </div>
  );
}
