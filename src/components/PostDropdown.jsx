import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';
import { usePostHistoryContext } from '../ContextProvider.jsx';

export function PostDropdown({ postId, onEditMenuClick }) {
  const fetcher = useFetcher();
  const userPostHistoryList = usePostHistoryContext();

  return (
    <div className='absolute z-10'>
      <Button
        value={'Reply'}
      />

      {userPostHistoryList.includes(postId) &&
        <>
          <Button
            clickHandler={() => onEditMenuClick(postId)}
            value='Edit'
          />
          <Button
            clickHandler={deletePost}
            value={'Delete'}
            extraClass='del-btn '
            submitting={fetcher.data}
          />
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
