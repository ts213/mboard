import { useEdiMenuContext, useGlobalContextApi, usePostDropdownContext } from '../ContextProviders/GlobalContext.jsx';
import { memo, useEffect, useState } from 'react';
import { Post } from './Post.jsx';
import { routeLoader } from '../App.jsx';
import tippy from 'tippy.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { LoadMorePostsBtn } from './LoadMorePostsBtn.jsx';

const PostMemo = memo(Post);

export function PostList({ threads, loadMoreProps = undefined }) {
  const dropdown = usePostDropdownContext();
  const postEditMenu = useEdiMenuContext();
  const { onDropdownClick, onEditMenuClick } = useGlobalContextApi();

  const [dateNow, setDate] = useState(new Date());
  useEffect(() => setDate(new Date()), [threads]);

  return (
    <div className='m-12'
         onMouseOver={(ev) => showTooltip(ev, threads, dateNow)}
    >
      {threads.map(thread =>
        <section
          key={thread.id}
          className='flex flex-col flex-wrap items-start'>
          {loadMoreProps && <LoadMorePostsBtn {...loadMoreProps} />}
          <PostMemo
            post={thread}
            dateNow={dateNow}
            isEditMenu={postEditMenu === thread.id}
            isDropdown={dropdown === thread.id}
            onDropdownClick={onDropdownClick}
            onEditMenuClick={onEditMenuClick}
          />

          {thread.replies.map(reply =>
            <PostMemo
              key={reply.id}
              post={reply}
              dateNow={dateNow}
              isEditMenu={postEditMenu === reply.id}
              isDropdown={dropdown === reply.id}
              onDropdownClick={onDropdownClick}
              onEditMenuClick={onEditMenuClick}
            />
          )}
        </section>
      )}
    </div>
  );
}

async function showTooltip(ev, threads, dateNow) {
  if (ev.target.classList.contains('quote-link') && !Object.hasOwn(ev.target, '_tippy')) {
    const regex = /#(\d+)/;
    const quotedPostId = ev.target.href.match(regex)[1];  // [1] first matched group

    let postObject = threads.concat(
      threads.flatMap(thread => thread.replies)
    ).find(post => post.id == quotedPostId);

    if (!postObject) {
      try {
        const request = new Request(`/post/${quotedPostId}/`);
        postObject = await routeLoader(request);
      } catch {
        tooltipProps.content = '';
        tippy(ev.nativeEvent.target, tooltipProps);
        return;
      }
    }
    tooltipProps.content = renderToStaticMarkup(<Post post={postObject} dateNow={dateNow} />);
    tippy(ev.nativeEvent.target, tooltipProps);
  }
}

const tooltipProps = {
  role: 'tooltip',
  interactive: true,
  allowHTML: true,
  placement: 'top-end',
  showOnCreate: true,
  arrow: false,
  delay: [150, 150],
  maxWidth: 'none',
  // onHidden: instance => instance.destroy(),
};
