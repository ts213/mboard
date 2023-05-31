import { usePostHistoryContext } from '../context/PostHistoryContext.jsx';

export function usePostPermissions(post) {
  let boards = JSON.parse(localStorage.getItem('boards'));
  const postIdList = usePostHistoryContext();
  const userPost = postIdList.find(userPost => userPost.id === post.id);

  if (boards?.includes('*')) {
    return Permissions({canEdit: true, canDelete: true, canBan: true, canClose: true})
  }

  if (boards?.includes(post.board)) {
    return Permissions({
      canEdit: Boolean(post.thread) && userPost?.ed, canDelete: true, canBan: true, canClose: !post.thread,
    });
  }

  const timeDiff = new Date().getTime() - post.date * 1000;  // post.date in secs
  const allowed_interval = (timeDiff / 1000 / 60 / 60 / 24) <= 1;
  if (!allowed_interval) {
    return Permissions({
      canEdit: false, canDelete: false, canBan: false, canClose: false,
    });
  }

  if (!post.thread) {
    return Permissions({
      canEdit: false, canDelete: false, canBan: false, canClose: false,
    });
  }

  return Permissions({
      canEdit: Boolean(userPost?.ed), canDelete: Boolean(userPost?.del), canBan: false, canClose: !post.thread,
    }
  );
}

function Permissions({ canEdit, canDelete, canBan, canClose }) {
  return {
    canEdit,
    canDelete,
    canBan,
    canClose,
  }
}
