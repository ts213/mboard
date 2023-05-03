import { useEdiMenuContext, useGlobalContextApi, usePostDropdownContext } from '../../context/GlobalContext.jsx';
import { memo, useEffect, useState } from 'react';
import { Post } from './Post.jsx';
import { LoadMorePostsBtn } from './LoadMorePostsBtn.jsx';
import { showTooltip } from '../../utils/showTooltip.jsx';

const PostMemo = memo(Post);

export function PostList({ threadList, loadMoreProps = undefined }) {
  const dropdown = usePostDropdownContext();
  const postEditMenu = useEdiMenuContext();
  const { onDropdownClick, onEditMenuClick } = useGlobalContextApi();

  const [dateNow, setDate] = useState(new Date());
  useEffect(() => setDate(new Date()), [threadList]);

  return (
    <div
      className='threads-wrap'
      onMouseOver={ev => showTooltip(ev, threadList, dateNow)}
    >
      {threadList.map(thread =>
        <section
          key={thread.id}
          className='thread'>
          {loadMoreProps && <LoadMorePostsBtn {...loadMoreProps} />}
          <PostMemo{...postProps(thread)} />

          {thread.replies.map(reply =>
            <PostMemo key={reply.id} {...postProps(reply)} />
          )}
        </section>
      )}
    </div>
  );

  function postProps(post) {
    return {
      post,
      dateNow,
      isEditMenu: postEditMenu === post.id,
      isDropdown: dropdown === post.id,
      onDropdownClick,
      onEditMenuClick,
    };
  }
}
