import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
console.log(PropTypes) // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function Post({ thread, isThreadsList }) {
  const opPostBg = thread.thread ? 'bg-slate-800' : '';
  const linkIntoThread = <Link to={'thread/' + thread.id + '/'}>В тред</Link>;

  return (
    <article key={thread.id}
             className={`post ${opPostBg} p-2 m-2 whitespace-pre-wrap clear-both`}>
      <header className='thread-header m-2 '>
        <span className='poster'>{thread.poster === '' ? 'Анон' : thread.poster}</span>
        <span className='date ml-2'>{thread.date}</span>
        <span className='post-id ml-2'>{thread.id}</span>
        {isThreadsList && linkIntoThread}
      </header>
      <div className='post-body'>
        <a className='float-left' href='/fullimageurl'>
          <img className=' mr-4 float-left' src={thread.thumb} alt='' />
        </a>
        <blockquote className='m-2' dangerouslySetInnerHTML={{ __html: thread.text }} />
      </div>
    </article>
  );
}
