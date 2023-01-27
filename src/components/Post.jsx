import { Link, useOutletContext } from 'react-router-dom';
import { useRef, useState } from 'react';
import { PostToggleMenu } from './PostToggleMenu.jsx';
import { PostEdit } from './PostEdit.jsx';
// import PropTypes from 'prop-types';
// console.log(PropTypes) // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function Post({ post, isThreadsList }) {
  const notOPpost = post.thread ? 'bg-slate-800 border dark:border-gray-600' : '';

  const { postEditable, setPostEditable, menuId, toggleEditMenu, toggleDropdownMenu } = useOutletContext();

  const editable = postEditable === post.id;
  const linkIntoThread = <Link to={'thread/' + post.id + '/'} className={'ml-2'}>В тред</Link>;
  const postTextElmnt = useRef();

  const [postTextBeforeEdit, setpostTextBeforeEdit] = useState(undefined);

  return (
    <article key={post.id}
             className={`${notOPpost} p-2 m-2 whitespace-pre-wrap clear-both`}>
      <header className='thread-header'>
        <span className='poster'>{post.poster === '' ? 'Анон' : post.poster}</span>
        <span className='date ml-2'>{post.date}</span>
        <span className='post-id ml-2'>{post.id}</span>
        <PostToggleMenu post={post}  // change to post.id ???
                        menuId={menuId}
                        toggleDropdownMenu={toggleDropdownMenu}
                        toggleEditMenu={toggleEditMenu}
                        setPostTextBeforeEdit={setpostTextBeforeEdit}
        />
        {isThreadsList && linkIntoThread}
      </header>
      <div className='post-body'>
        <a className='float-left' href={post.thumb}>
          <img className=' mr-4 float-left' src={post.thumb} alt='' />
        </a>
        <blockquote ref={postTextElmnt}
                    onKeyDown={(e) => pzdc(e)}
                    className={`m-2 overflow-auto${editable ? 'border-dotted border-2 border-sky-500 resize overflow-scroll' : ''}`}
                    contentEditable={editable}
                    dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>
      {
        editable && <PostEdit
          setPostEditable={setPostEditable}
          postTextElmnt={postTextElmnt}
          postId={post.id}
          postTextBeforeEdit={postTextBeforeEdit}
        />
      }
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

