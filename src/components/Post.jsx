import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// console.log(PropTypes) // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// after:content-[''] after:w-full after:border after:block

export function Post({ post, isThreadsList }) {
  const opPostBg = post.thread ? 'bg-slate-800' : '';
  const linkIntoThread = <Link to={'thread/' + post.id + '/'} className={'ml-2'}>В тред</Link>;

  return (
    <article key={post.id}
             className={`post ${opPostBg} p-2 m-2 whitespace-pre-wrap clear-both`}>
      <header className='thread-header'>
        <span className='poster'>{post.poster === '' ? 'Анон' : post.poster}</span>
        <span className='date ml-2'>{post.date}</span>
        <span className='post-id ml-2'>{post.id}</span>
        {isThreadsList && linkIntoThread}
      </header>
      <div className='post-body'>
        <a className='float-left' href={post.thumb}>
          <img className=' mr-4 float-left' src={post.thumb} alt='' />
        </a>
        <blockquote className='m-2' dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>
    </article>
  );
}
