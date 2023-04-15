import '../styles/BoardList.css'
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function BoardList() {
  const boardList = useLoaderData();

  return (
    boardList.map(board =>
      <div
        key={board.link}
        className='board-list'
      >
        <Link to={'../' + board.link + '/'}>{board.title}</Link>
        <hr className='board-list-hr'/>
      </div>
    )
  )
}

export async function boardLoader({ request }) {
  let url = import.meta.env.VITE_API_PREFIX + new URL(request.url).pathname;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
