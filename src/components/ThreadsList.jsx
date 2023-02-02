import { useLoaderData } from 'react-router-dom';
import { Post } from './Post';
import React, { useEffect, useRef, useState } from 'react';
import { PostsWrapper } from './PostsWrapper.jsx';
import { PostForm } from './PostForm.jsx';
import { Tooltip, flip, shift } from 'react-tooltip'
// import 'react-tooltip/dist/react-tooltip.css'

export default function ThreadsList() {
  const data = useLoaderData();

  const [tltp, setTltp] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [tarr, setTarr] = useState([]);
  // const [lst, setLst] = useState([]);
  const ref = useRef();
  const [c, setC] = useState(354);
  const [s, setS] = useState([]);

  useEffect(() => {
      document.addEventListener('mouseover', asd)
      // document.addEventListener('mouseout', qwe)

      return () => document.removeEventListener('mouseover', asd)

    }, [asd]
  );

  function qwe(e) {
    if (s.length > 0 && e.target.className !== 'react-tooltip') {
      setS([])
    }
  }

  function asd(e) {
    if (e.target.className === 'quote-link') {

      e.target.id = 'quote' + e.target.closest('article').id;
      const href = e.target.href;
      const id = /#\d+/.exec(href).at(0).replace('#', '');
      setC(prevState => prevState + 1);

      const quotedEl = document.getElementById(id)

      if (!s.some(obj => obj.props.id === `t${id}`)) {
        setS([...s, <Tooltip key={c}
                             id={'t' + id}
                             anchorId={e.target.id}
                             html={quotedEl.outerHTML}
                             clickable
                             place='bottom'
                             offset='20'
                             // afterHide={() => console.log('aa')}
                             middlewares={[shiftBy, flip(), shift()]}
                             // events={[]}
                             onH
                             // noArrow={true}
          // closeOnEsc={true}

          // afterHide={() => setS(prevState =>
          //   prevState.filter(value => value.props.id !== `t${id}`))}
        />])
        // s.forEach(t => console.log(t.props))
      }
    }
  }


  const shiftBy = {
    name: 'shiftBy',
    fn({ x, y }) {
      return {
        x: x + 355,
        // y: y + 31,
      };
    },
  };

  const posts = data.threads.map(thread =>
    <React.Fragment key={thread.id}>

      <section className={'flex flex-col flex-wrap items-start '}>
        <Post
          post={thread}
          isThreadsList={true}
        />
        {thread.replies.map(reply =>
          <Post
            key={reply.id}
            post={reply}
            isThreadsList={false}
          />
        )}
      </section>
      <hr className={'w-full border-t-gray-500'} />
    </React.Fragment>
  );

  return (
    <>
      <div id={'tid'}>{s}ss</div>
      <input readOnly className={'bg-black'} value={tarr.length} />
      <input readOnly className={'bg-black'} value={c} />
      {/*<Tooltip  html={html} isOpen={isOpen} anchorId={tltp} place='top' />*/}
      {/*<Tooltip clickable isOpen anchorId={tltp} place='right'>*/}
      {/*  {tltp}*/}
      {/*  <div ref={ref}></div>*/}
      {/*</Tooltip>*/}
      <PostsWrapper>
        {posts}
      </PostsWrapper>
      <PostForm />
    </>
  )
}
