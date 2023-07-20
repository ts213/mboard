import { Link, useLoaderData, useParams } from 'react-router-dom';
import '../styles/Catalog.css';
import { useState } from 'react';

export function Catalog() {
  const threads = useLoaderData() ?? [];
  const { board } = useParams();
  const [filteredThreads, setThreads] = useState(threads);

  function onInput(ev) {
    setThreads(
      threads.filter(thread => thread.text.toLowerCase().includes(ev.target.value.toLowerCase()))
    );
  }

  return (
    <div className='catalog-cont'>
      <input type='search' onInput={onInput} className='catalogSearch' />
      <Link to='../' relative='path' className='catalog-link-board'>
        {board}
      </Link>
      <br />
      {filteredThreads.map(thread =>
        <article className='catalog-thread' key={thread.id}>
          <div className='catalog-image-wrap'>
            <Link to={'/' + thread.board + '/thread/' + thread.id + '/'}>
              <img className='catalog-image' src={thread.images[0]?.thumb} alt='' />
            </Link>
          </div>
          <div className='catalog-post-count'>Replies: {thread.replies_count}</div>
          <div className='catalog-text'
               dangerouslySetInnerHTML={{ __html: thread.text.slice(0, 220) }}
          />
        </article>
      )}
    </div>
  )
}
