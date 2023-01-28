import { useLoaderData, useOutletContext } from 'react-router-dom';
import { Post } from './Post';
import React, { useEffect } from 'react';
import { PostsWrapper } from './PostsWrapper.jsx';
import { PostForm } from './PostForm.jsx';
import { computePosition, offset, shift } from '@floating-ui/react';
import { flip } from '@floating-ui/react-dom';

export default function ThreadsList() {
  const data = useLoaderData();

  const { tooltip } = useOutletContext();




  function update(target) {
    computePosition(target, tooltip.current, {
      placement: 'right',
      middleware: [offset({ mainAxis: 15, crossAxis: -35 }), flip(), shift()], // offset(5) offset should be before most others to modify their coordinates
    }).then(({ x, y }) => {
      Object.assign(tooltip.current.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  function showTooltip(e) {
    const href = e.target.href;
    const id = /#\d+/.exec(href).at(0).replace('#', '');
    const quotedEl = document.getElementById(id)

    tooltip.current.innerHTML = quotedEl.outerHTML;
    tooltip.current.style.display = 'block';
    update(e.target);
  }

  function hideTooltip() {
      tooltip.current.style.display = '';
  }

  useEffect(() => {
    const quotes = document.getElementsByClassName('quote-link');
    for (let quote of quotes) {
      [
        ['mouseenter', showTooltip],
        ['mouseleave', hideTooltip],
        ['focus', showTooltip],
        ['blur', hideTooltip],
      ].forEach(([event, listener]) => quote.addEventListener(event, listener))
    }
  }, []);

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
      <PostsWrapper>
        {posts}
      </PostsWrapper>
      <PostForm />
    </>
  )
}


//
//
//              onMouseEnter={showTooltip}
//              onMouseLeave={hideTooltip}


// export async function dataLoader({ params }) {
//   // const r = await fetch(`${import.meta.env.VITE_API}/${params.board}/`);
//   const r = await fetch(`/api/${params.board}/`);
//   if (!r.ok) {
//     // throw Error(`fetch thread list !!! error ${r.statusText}`);
//     throw new Response('loader error', { status: r.status })
//   }
//   return await r.json();
// }

