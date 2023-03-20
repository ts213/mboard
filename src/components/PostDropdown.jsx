import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';
import { usePostHistoryContextList } from '../ContextProviders/PostHistoryContext.jsx';

export function PostDropdown({ postId, onEditMenuClick, postDateSecs }) {
  const fetcher = useFetcher();
  const postIdList = usePostHistoryContextList();
  const timeDiff = new Date().getTime() - postDateSecs * 1000;
  const allowed_interval = timeDiff / 1000 / 60 / 60 / 24 < 24;

  return (
    <div className='absolute z-10'>
      <Button
        value={'Reply'}
      />

      {allowed_interval &&
        <>
          {postIdList.some(post => post.id === postId && post.ed) &&
            <Button
              clickHandler={() => onEditMenuClick(postId)}
              value='Edit'
            />
          }

          {postIdList.some(post => post.id === postId && post.del) &&
            <Button
              clickHandler={deletePost}
              value={'Delete'}
              extraClass='del-btn '
              submitting={fetcher.data}
            />
          }
        </>
      }

    </div>
  );

  function deletePost() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/delete/${postId}/` }
    );
  }
}
