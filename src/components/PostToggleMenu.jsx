import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';

export function DropdownContext({ postId, onEditMenuClick }) {
  const fetcher = useFetcher();

  return (
    <div className='absolute z-10'>
      <Button
        clickHandler={() => onEditMenuClick(postId)}
        value='Edit'
        extraClass='w-full '
      />
      <Button
        clickHandler={deletePost}
        value={'Delete'}
        extraClass='del-btn w-full '
        submitting={fetcher.data}
      />
    </div>
  );

  function deletePost() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/delete/${postId}/` }
    );
  }
}
