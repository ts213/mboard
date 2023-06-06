import '../styles/Post.css';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { PostDropdown } from './PostDropdown.jsx';
import { PostEdit } from './PostEdit.jsx';
import { PostImage } from './PostImage.jsx';
import { toggleFloatingForm, toRelativeTime } from '../../utils/utils.js';

// import PropTypes from 'prop-types';

export function Post({
                       post, dateNow, closed, isEditMenu, isDropdown,
                       onDropdownClick, onEditMenuClick, dispatch = undefined,
                       board = undefined,
                     }) {
  const postTextElmnt = useRef();

  return (
    <article
      id={post.id}
      className={`post ${post.thread ? 'reply-post' : ''} ${isEditMenu ? 'edit-menu' : ''}`}
    >
      <header>
        <span>{post.poster ? post.poster : 'Anon'}</span>
        <time>{toRelativeTime(post.date, dateNow)}</time>
        <a href={`#${post.id}`}
           onClick={onPostIdClick}
           className='postId'
        >
          {post.id}
        </a>

        {(closed && !post.thread) && <span title='Thread closed'>🔒</span>}

        <div style={{ marginLeft: '0.5rem', display: 'inline-block' }}>
          <span
            onClick={() => onDropdownClick(post.id)}
            className='dropdown-btn'
          >
            ▶
          </span>

          {isDropdown &&
            <PostDropdown
              post={post}
              onEditMenuClick={onEditMenuClick}
              onDropdownClick={onDropdownClick}
              dispatch={dispatch}
              closed={closed}
            />
          }
        </div>

        {!post.thread &&
          <Link className='thread-link'
                to={'/' + post.board + '/thread/' + post.id + '/'}
                state={{ from: '/' + board + '/' }}
          >
            Open
          </Link>}
        {board === 'all' && <span className='overboard-board' style={{ color: 'gray' }}>/{post.board}/</span>}
      </header>

      {post.images?.length > 0 &&
        <div className='post-images-cont'
             style={{ float: post.images.length > 1 ? '' : 'left', }}
        >
          {post.images.map((image, idx) =>
            <PostImage
              key={idx}
              image={image.image}
              thumb={image.thumb}
              width={image.width}
              height={image.height}
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
        className='post-text'
        style={isEditMenu ? { visibility: 'hidden', height: '0' } : undefined}
        dangerouslySetInnerHTML={{ __html: post.text }}
      />

      <sub className='replies' />
    </article>
  );

  function onPostIdClick(ev) {
    ev.preventDefault();
    if (closed) {
      return;
    }

    toggleFloatingForm({ force: false, post, dispatch });
  }
}
