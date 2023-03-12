import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';

export function DropdownContext({ postId, onEditMenuClick }) {
  const fetcher = useFetcher();

  return (
    <div className='absolute z-10'>
      <Button
        clickHandler={() => onEditMenuClick(postId)}
        value='Edit'
        extraStyle='w-full '
      />
      <Button
        clickHandler={del}
        value={'Delete'}
        extraStyle='w-full '
      />
    </div>
  );

  function del() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/delete/${postId.id}/` }
    );
  }
}
