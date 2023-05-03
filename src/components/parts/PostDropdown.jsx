import { Button } from './Button.jsx';
import { useFetcher, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePostPermissions } from '../../hooks/usePostPermissions.jsx';

export function PostDropdown({ post, onEditMenuClick }) {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [canEdit, canDelete] = usePostPermissions(post);

  useEffect(() => {
    if (fetcher.data?.deleted) {
      window.dispatchEvent(new CustomEvent(
        'postDeleted',
        { detail: { postId: fetcher.data?.post.id } }
      ));
      if (!post.thread) {
        navigate('../..', { relative: 'path' });
      }
    }
  }, [fetcher.data?.deleted, fetcher.data?.post.id, navigate, post.thread]);

  return (
    <div className='dropdown-menu'>
      <Button value={'Reply'} />
      {canEdit &&
        <Button
          clickHandler={() => onEditMenuClick(post.id)}
          value='Edit'
          extraStyle={{ display: 'block' }}
        />
      }

      {canDelete &&
        <Button
          clickHandler={deletePost}
          value={'Delete'}
          submitting={fetcher.data}
          extraStyle={{ display: 'block' }}
          extraClass='del-btn'
        />
      }
    </div>
  );

  function deletePost() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/post/${post.id}/` }
    );
  }
}
