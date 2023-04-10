import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { PostDropdown } from './PostDropdown.jsx';
import { PostEdit } from './PostEdit.jsx';
import { PostImage } from './PostImage';
import { toRelativeTime } from '../utils/timeToRelative.js';
// import PropTypes from 'prop-types';

export function Post({ post, dateNow, isEditMenu, isDropdown, onDropdownClick, onEditMenuClick }) {

  const postTextElmnt = useRef();
  return (
    <article id={post.id}
             className={`text-white p-2 m-2 whitespace-pre-wrap clear-both 
             ${post.thread ? 'bg-slate-800 border border-gray-600' : ''}
             ${isEditMenu ? 'border-2 border-sky-500 border-dotted' : ''}`}
    >
      <header>
        <span>{post.poster ? post.poster : 'Anon'}</span>
        <span className='ml-2'>{toRelativeTime(post.date, dateNow)}</span>
        <span className='post-id ml-2'>{post.id}</span>

        <div className='ml-2 inline-block'>
          <button
            type='button'
            onClick={() => onDropdownClick(post.id)}
            className='dropdown cursor-pointer font-serif'
          >
            ▶
          </button>

          {isDropdown &&
            <PostDropdown
              postId={post.id}
              postDateSecs={post.date}
              onEditMenuClick={onEditMenuClick}
            />
          }
        </div>

        {(!document.location.pathname.includes('thread') && !post.thread) &&
          <Link to={'thread/' + post.id + '/'} className={'ml-2'}>Open</Link>}
      </header>

      {post.files?.length > 0 &&
        <div className={`flex ${post.files.length > 1 ? '' : 'float-left'}`}>
          {post.files.map((file, idx) =>
            <PostImage
              key={idx}
              image={file.image}
              thumb={file.thumb}
              width={file.width}
              height={file.height}
            />
          )}
        </div>
      }

      {isEditMenu &&
        <PostEdit
          postId={post.id}
          onEditMenuClick={onEditMenuClick}
          postTextElmnt={postTextElmnt.current}
          board={post.board}
        />
      }

      <blockquote
        ref={postTextElmnt}
        className={`m-2 ml-0 overflow-auto ${isEditMenu && 'invisible h-0'}`}
        dangerouslySetInnerHTML={{ __html: post.text }}
      />

      <sub className='replies'></sub>
    </article>
  );
}
