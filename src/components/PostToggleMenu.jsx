import { SubmitButton } from './SubmitButton.jsx';
import { useFetcher } from 'react-router-dom';

export function PostToggleMenu({
                                 post,
                                 menuId,
                                 toggleDropdownMenu,
                                 toggleEditMenu,
                                 setPostTextBeforeEdit,
                               }) {

  const fetcher = useFetcher();
  return (
    <div className='ml-2 relative inline-block'>
      <button type='button'
              onClick={() => toggleDropdownMenu(post.id)}
              className='dropdown cursor-pointer font-serif'>
        ▶
      </button>
      {menuId === post.id && <DropdownContext />}
    </div>
  );

  function DropdownContext() {
    return (
      <div className='absolute z-10 '>
        <SubmitButton clickHandler={editPost} value='Edit' extraStyle='w-full ' />
        <SubmitButton clickHandler={del} value={'Delete'} extraStyle='w-full ' />
      </div>
    )
  }

  function editPost() {
    setPostTextBeforeEdit(post.text);
    toggleEditMenu(post.id);
    toggleDropdownMenu(0);
  }

  function del() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/delete/${post.id}/` }
    );
  }

}
