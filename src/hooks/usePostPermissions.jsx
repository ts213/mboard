import { usePostHistoryContext } from '../context/PostHistoryContext.jsx';

export function usePostPermissions(post) {
  const timeDiff = new Date().getTime() - post.date * 1000;  // post.date in secs
  const allowed_interval = (timeDiff / 1000 / 60 / 60 / 24) <= 1;
  if (!allowed_interval) {
    return [false, false, false];
  }

  const boards = JSON.parse(localStorage.getItem('boards'));
  if (boards?.includes(post.board)) {
    return [true, true, true];
  }

  if (!post.thread) {
    return [false, false, false];
  }

  const postIdList = usePostHistoryContext();  // eslint-disable-line
  const user_post = postIdList.find(user_post => user_post.id === post.id);
  return [user_post?.ed, user_post?.del, false];
}
