import { Link, useFetcher } from 'react-router-dom';
import { useRef } from 'react';
import { PostMenuButton } from './PostMenuButton.jsx';
import { PostEdit } from './PostEdit.jsx';
// import PropTypes from 'prop-types';
// console.log(PropTypes) // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function Post({
                       post, isThreadsList, menuId, toggleDropdownMenu, postEditable,
                       setPostEditable, toggleEditMenu
                     }) {
  const opPostBg = post.thread ? 'bg-slate-800' : '';
  const editable = postEditable === post.id;
  const linkIntoThread = <Link to={'thread/' + post.id + '/'} className={'ml-2'}>В тред</Link>;

  const testRef = useRef();

  return (
    <article key={post.id}
             className={`${opPostBg} p-2 m-2 whitespace-pre-wrap clear-both`}>
      <header className='thread-header'>
        <span className='poster'>{post.poster === '' ? 'Анон' : post.poster}</span>
        <span className='date ml-2'>{post.date}</span>
        <span className='post-id ml-2'>{post.id}</span>
        <PostMenuButton post={post}  // change to post.id ???
                        menuId={menuId}
                        toggleDropdownMenu={toggleDropdownMenu}
                        toggleEditMenu={toggleEditMenu}
        />
        {isThreadsList && linkIntoThread}
      </header>
      <div className='post-body'>
        <a className='float-left' href={post.thumb}>
          <img className=' mr-4 float-left' src={post.thumb} alt='' />
        </a>
        <blockquote ref={testRef}
                    onKeyDown={(e) => pzdc(e)}
                    className={`m-2 overflow-auto${editable ? 'border-dotted border-2 border-sky-500 resize overflow-scroll' : ''}`}
                    contentEditable={editable}
                    dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>
      {
        editable && <PostEdit
          setPostEditable={setPostEditable}
          testRef={testRef}
          post={post}
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

