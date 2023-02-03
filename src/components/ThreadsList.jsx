import { useLoaderData } from 'react-router-dom';
import { Post } from './Post';
import React, { useEffect } from 'react';
import { PostsWrapper } from './PostsWrapper.jsx';
import { PostForm } from './PostForm.jsx';
import tippy from 'tippy.js';


export default function ThreadsList() {
  const data = useLoaderData();

  useEffect(() => {
    document.addEventListener('mouseover', showTooltip);

    function showTooltip(ev) {
      if (ev.target.className === 'quote-link' && !Object.hasOwn(ev.target, '_tippy')) {
        const href = ev.target.href;
        const quotedPostId = /#\d+/.exec(href)[0].replace('#', '');   // at(0) => [0]
        const quotedEl = document.getElementById(quotedPostId);

        tippy(ev.target, {
          content: quotedEl.cloneNode(true),
          ...tippyProps,
        });
      }
    }

    return () => document.removeEventListener('mouseover', showTooltip);

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

const tippyProps = {
  role: 'tooltip',
  interactive: true,
  allowHTML: true,
  placement: 'top-end',
  appendTo: document.body,
  showOnCreate: true,
  arrow: false,
  delay: [200, 200],
  maxWidth: 'none',
  onHidden(instance) {
    instance.destroy();
  },
};
