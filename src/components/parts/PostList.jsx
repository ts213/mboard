import { useEdiMenuContext, useGlobalContextApi, usePostDropdownContext } from '../../context/GlobalContext.jsx';
import { memo, useEffect, useState } from 'react';
import { Post } from './Post.jsx';
import { showTooltip } from '../../utils/showTooltip.jsx';
import { ImageOverlay } from './ImageOverlay.jsx';
import { useThreadEventListeners } from '../../hooks/useThreadEventListeners.jsx';
import { addRepliesToPosts, onQuotedPostClick } from '../../utils/utils.js';
import { useFormDispatchContext } from '../posting/PostFormReducer.jsx';

const PostMemo = memo(Post);

export function PostList({ threadList }) {
  const dropdown = usePostDropdownContext();
  const postEditMenu = useEdiMenuContext();
  const { onDropdownClick, onEditMenuClick } = useGlobalContextApi();
  useThreadEventListeners();
  const dispatch = useFormDispatchContext();

  useEffect(() => {
    addRepliesToPosts();
  }, [threadList]);

  const [dateNow, setDate] = useState(new Date());
  useEffect(() => setDate(new Date()), [threadList]);

  const postList =
    <div
      onMouseOver={ev => showTooltip(ev, threadList, dateNow, threadList[0].board)}
      onClick={onQuotedPostClick}
    >
      {threadList.map(thread =>
        <section
          key={thread.id}
          className='thread'
        >
          <PostMemo {...postProps(thread)} closed={thread.closed} />

          {thread.replies.map(reply =>
            <PostMemo
              key={reply.id}
              {...postProps(reply)}
              closed={thread.closed}
            />
          )}
        </section>
      )}
    </div>;

  return (
    <>
      {postList}
      <ImageOverlay />
    </>
  );

  function postProps(post) {
    return {
      post,
      dateNow,
      isEditMenu: postEditMenu === post.id,
      isDropdown: dropdown === post.id,
      onDropdownClick,
      onEditMenuClick,
      dispatch,
    };
  }
}
