import '../styles/BoardList.css'
import { Link, useLoaderData } from 'react-router-dom';
import i18n from '../../utils/translation.js';

export function BoardList() {
  const boardList = useLoaderData() ?? [];
  document.title = 'boards';

  return (
    <>
      <Link to='../'
            style={{ fontSize: 'xx-large', margin: '1rem 0 0 1rem' }}>
        ←
      </Link>
      <table className='board-list'>
        <thead>
        <tr>
          <th>{i18n.board}</th>
          <th>{i18n.boardTitle}</th>
          <th>{i18n.postsLast24h}</th>
          <th>{i18n.posts}</th>
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
