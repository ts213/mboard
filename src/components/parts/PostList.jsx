import { useEdiMenuContext, useGlobalContextApi, usePostDropdownContext } from '../../context/GlobalContext.jsx';
import { memo, useEffect, useRef } from 'react';
import { Post } from './Post.jsx';
import { showTooltip } from '../../utils/showTooltip.jsx';
import { ImageOverlay } from './ImageOverlay.jsx';
import { useThreadEventListeners } from '../../hooks/useThreadEventListeners.jsx';
import { addRepliesToPosts, onQuotedPostClick } from '../../utils/utils.js';
import { useFormDispatchContext } from '../posting/PostFormReducer.jsx';

const PostMemo = memo(Post);

export function PostList({ threadList, board, pageNum }) {
  const dropdown = usePostDropdownContext();
  const postEditMenu = useEdiMenuContext();
  const { onDropdownClick, onEditMenuClick, onImageClick } = useGlobalContextApi();
  useThreadEventListeners();
  const dispatch = useFormDispatchContext();
  let dateNow = useRef(new Date());

  useEffect(() => {
    addRepliesToPosts();
    dateNow.current = new Date()
  }, [threadList]);

  return (
    <>
      <div
        onMouseOver={ev => showTooltip(ev, threadList, dateNow.current, threadList[0].board, onImageClick)}
        onClick={onQuotedPostClick}
      >
        {threadList.map(thread =>
          <section key={thread.id} className='thread'>
            <PostMemo {...postProps(thread)} board={board} />
            {thread.replies.map(reply =>
              <PostMemo key={reply.id} {...postProps(reply)} />
            )}
            {pageNum && <RepliesCount count={thread.replies_count} />}
          </section>
        )}
      </div>
      <ImageOverlay onClick={onImageClick} />
    </>
  );

  function postProps(post) {
    return {
      post,
      dateNow: dateNow.current,
      closed: post.closed,
      isEditMenu: postEditMenu === post.id,
      isDropdown: dropdown === post.id,
      onDropdownClick,
      onEditMenuClick,
      dispatch,
    };
  }
}

function RepliesCount({ count }) {
  return (
    <sub style={{ color: 'gray', marginLeft: '0.5rem' }}>
      Replies: {count}
    </sub>
  )
}
/** @property {Number} thread.replies_count */
