import '../styles/BoardList.css'
import { Link, useLoaderData } from 'react-router-dom';

export function BoardList() {
  const boardList = useLoaderData() ?? [];

  return (
    <>
      <Link to='../'
            style={{ fontSize: 'xx-large', margin: '1rem 0 0 1rem' }}>
        ←
      </Link>
      <table className='board-list'>
        <thead>
        <tr>
          <th>Board</th>
          <th>Title</th>
          <th>Post last 24 hours</th>
          <th>Posts</th>
        </tr>
        </thead>
        <tbody>
        {boardList.map((board, idx) =>
          <tr key={idx}>
            <td style={{ color: 'white' }}>
              <Link to={'/' + board.link + '/'}>/{board.link}/</Link>
            </td>
            <td className='board-list-title'>
              <Link to={'/' + board.link + '/'}>{board.title}</Link>
            </td>
            <td style={{ width: 'calc(100%/8)' }}>{board.posts_last24h}</td>
            <td style={{ width: 'calc(100%/8)' }}>{board.posts_count}</td>
          </tr>
        )}
        </tbody>
      </table>
    </>
  )
}
