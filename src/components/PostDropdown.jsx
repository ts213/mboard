import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';
import { usePostHistoryContext } from '../ContextProvider.jsx';

export function PostDropdown({ postId, onEditMenuClick }) {
  const fetcher = useFetcher();
  const postIdList = usePostHistoryContext();

  return (
    <div className='absolute z-10'>
      <Button
        value={'Reply'}
      />

      <>
        {postIdList.some(post => post.id === postId && post.editable) &&
          <Button
            clickHandler={() => onEditMenuClick(postId)}
            value='Edit'
          />
        }

        {postIdList.some(post => post.id === postId && post.deletable) &&
          <Button
            clickHandler={deletePost}
            value={'Delete'}
            extraClass='del-btn '
            submitting={fetcher.data}
          />
        }
      </>

    </div>
  );

  function deletePost() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/delete/${postId}/` }
    );
  }
}
