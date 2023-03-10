import { Link } from 'react-router-dom';
import { memo, useRef, useState } from 'react';
import { PostToggleMenu } from './PostToggleMenu.jsx';
import { PostEdit } from './PostEdit.jsx';
import { PostImage } from './PostImage';
import { toRelativeTime } from '../utils/timeToRelative.js';
// import PropTypes from 'prop-types';
// console.log(PropTypes) // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function Post({ post, dateNow, isEditMenu, onEditMenuClick, isDropdown, onDropdownClick }) {
  const notOPpost = post.thread ? 'bg-slate-800 border border-gray-600' : '';
  console.log('postjsx');

  const linkIntoThread = <Link to={'thread/' + post.id + '/'} className={'ml-2'}>Open</Link>;
  const postTextElmnt = useRef();

  return (
    <article key={post.id}
             id={post.id}
             className={`${notOPpost} text-white p-2 m-2 whitespace-pre-wrap clear-both`}>

      <header>
        <span>{post.poster ? post.poster : 'Anon'}</span>
        <span className='ml-2'>{toRelativeTime(post.date, dateNow)}</span>
        <span className='post-id ml-2'>{post.id}</span>
        <PostToggleMenu
          post={post}
          postTextElmnt={postTextElmnt}
          onEditMenuClick={onEditMenuClick}
          isDropdown={isDropdown}
          onDropdownClick={onDropdownClick}
        />
        {!post.thread && linkIntoThread}
      </header>

      {post.files.length > 0 &&
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

      {
        !isEditMenu && <blockquote
        ref={postTextElmnt}
        onKeyDown={(e) => pzdc(e)}
        // className={`m-2 ml-0 overflow-auto${editable ? 'border-dotted border-2 border-sky-500 resize overflow-scroll' : ''}`}
        className={`m-2 ml-0 overflow-auto`}
        dangerouslySetInnerHTML={{ __html: post.text }}
      />
      }

      {isEditMenu && <PostEdit
          postId={post.id}
          onEditMenuClick={onEditMenuClick}
          postTextElmnt={postTextElmnt.current}
        // postTextBeforeEdit={postTextBeforeEdit}
        />}

      <sub className='replies'></sub>
    </article>
  );

  function pzdc(e) {
    if (e.keyCode === 13) {  // how'll work on mobile?
      // document.execCommand('insertLineBreak');
      document.execCommand('insertHTML', false, '\r\n');
      e.preventDefault();
    }
  }
}

const PostMemo = memo(Post);
export { PostMemo as Post };
