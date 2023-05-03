import '../styles/Post.css';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { PostDropdown } from './PostDropdown.jsx';
import { PostEdit } from './PostEdit.jsx';
import { PostImage } from './PostImage.jsx';
import { toRelativeTime } from '../../utils/timeToRelative.js';

// import PropTypes from 'prop-types';

export function Post({ post, dateNow, isEditMenu, isDropdown, onDropdownClick, onEditMenuClick }) {
  const postTextElmnt = useRef();

  return (
    <article
      id={post.id}
      className={`post ${post.thread ? 'reply-post' : ''} ${isEditMenu ? 'edit-menu' : ''}`}
    >
      <header>
        <span>{post.poster ? post.poster : 'Anon'}</span>
        <span className='post-date'>{toRelativeTime(post.date, dateNow)}</span>
        <span className='post-id'>{post.id}</span>

        <div className='dropdown-wrap'>
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
            />
          }
        </div>

        {(!document.location.pathname.includes('thread') && !post.thread) &&
          <Link to={'thread/' + post.id + '/'}
                style={{ marginLeft: '0.5rem' }}>
            Open
          </Link>}
      </header>

      {post.images?.length > 0 &&
        <div style={{
          display: 'flex',
          float: post.images.length > 1 ? '' : 'left',
        }}
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

      <sub className='replies'></sub>
    </article>
  );
}
