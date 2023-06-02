import { Link, useLoaderData, useParams } from 'react-router-dom';
import '../styles/Catalog.css';

export function Catalog() {
  const threads = useLoaderData() ?? [];
  const { board } = useParams();

  return (
    <div className='catalog-cont'>
      <Link to='../' relative='path' className='catalog-link-board'>
        {board}
      </Link>
      <br />
      {threads.map(thread =>
        <article className='catalog-thread' key={thread.id}>
          <div className='catalog-image-wrap'>
            <Link to={'/' + thread.board + '/thread/' + thread.id + '/'}>
              <img className='catalog-image' src={thread.images[0]?.thumb} alt='' />
            </Link>
          </div>
          <div className='catalog-post-count'>Replies: {thread.replies_count}</div>
          <div className='catalog-text'>
            {thread.text.slice(0, 220)}
          </div>
        </article>
      )}
    </div>
  )
}
