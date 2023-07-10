import { useEdiMenuContext, useGlobalContextApi, usePostDropdownContext } from '../../context/ThreadsContext.jsx';
import { memo, useContext, useEffect, useRef } from 'react';
import { Post } from './Post.jsx';
import { showQuotedPostTooltip } from '../../utils/showTooltip.jsx';
import { ImageOverlay } from './ImageOverlay.jsx';
import { useThreadEventListeners } from '../../hooks/useThreadEventListeners.jsx';
import { addRepliesToPosts, onQuotedPostClick } from '../../utils/utils.js';
import { useFormDispatchContext } from '../posting/PostFormReducer.jsx';
import { TranslationContext } from './RoutesWrapper.jsx';

const PostMemo = memo(Post);

export function PostList({ threadList, board, pageNum }) {
  const dropdown = usePostDropdownContext();
  const postEditMenu = useEdiMenuContext();
  const { onDropdownClick, onEditMenuClick, onImageClick } = useGlobalContextApi();
  const i18n = useContext(TranslationContext);
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
        onMouseOver={ev => showQuotedPostTooltip(ev, dateNow.current, threadList[0].board, onImageClick)}
        onClick={onQuotedPostClick}
      >
        {threadList.map(thread =>
          <section key={thread.id} className='thread'>
            <PostMemo {...postProps(thread)} board={board} />
            {thread.replies.map(reply =>
              <PostMemo key={reply.id} {...postProps(reply)} />
            )}
            {pageNum && <RepliesCount count={thread.replies_count} i18n={i18n} />}
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
      i18n,
    };
  }
}

function RepliesCount({ count, i18n }) {
  return (
    <sub style={{ color: 'gray', marginLeft: '0.5rem' }}>
      {i18n.replies}: {count}
    </sub>
  );
}

/** @property {Number} thread.replies_count */
