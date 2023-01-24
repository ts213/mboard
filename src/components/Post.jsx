import { Link, useFetcher, useLoaderData } from 'react-router-dom';
import { useRef } from 'react';
import { PostMenuButton } from './PostMenuButton.jsx';
// import PropTypes from 'prop-types';
// console.log(PropTypes) // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function Post({
                       post, isThreadsList, menuId, toggleDropdownMenu, postInput,
                       setPostInput, postEditable, setPostEditable, toggleEditMenu
                     }) {
  const opPostBg = post.thread ? 'bg-slate-800' : '';
  const linkIntoThread = <Link to={'thread/' + post.id + '/'} className={'ml-2'}>В тред</Link>;

  const fetcher = useFetcher();
  const testRef = useRef();

  // const [d, setD] = useState(fetcher.state)

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
                        testRef={testRef}
                        postInput={postInput}
                        setPostInput={setPostInput}
                        setPostEditable={setPostEditable}
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
                    className={`m-2 ${postEditable === post.id ? 'border-dotted border-2 border-sky-500 resize overflow-scroll' : ''}`}
                    contentEditable={postEditable === post.id}
                    dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>
      {postEditable === post.id && <div className={'float-right'}>
        <button className={'mr-4'} type='text'>Cancel</button>
        <button type='button' onClick={testSubm}>
          {`${fetcher.state === 'submitting' ? 'Saving...' : 'Update'}`}
        </button>
      </div>
      }
      <div className='text-center text-red-500 text-lg float-right'>
        {fetcher.data && fetcher.data.errMsg}
      </div>
    </article>
  );

  function pzdc(e) {  // contentEditable="plaintext-only" NOT WORKING IN FF
    if (e.keyCode === 13) {
      document.execCommand('insertLineBreak');
      e.preventDefault();
    }
  }

  function testSubm() {
    // const formData = new FormData();
    // formData.append("text", testRef.current.innerHTML);
    fetcher.submit(
      { text: testRef.current.innerHTML },
      { method: 'patch', action: `/edit/${post.id}/` });
    // console.log(fetcher)
    //  let status = fetcher.formData?.get("status")
    console.log(fetcher)
    setPostEditable(0)
    // console.log(fetcher.formMethod)

    // console.log(testRef.current.innerHTML)
  }

}

