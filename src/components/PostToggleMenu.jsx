import { Button } from './Button.jsx';
import { useFetcher } from 'react-router-dom';

export function PostToggleMenu({
                                 post,
                                 postTextElmnt, onEditMenuClick,
                                 isDropdown, onDropdownClick
                               }) {

  const fetcher = useFetcher();

  return (
    <div className='ml-2 inline-block'>
      <button type='button'
              onClick={() => onDropdownClick(post.id)}
              className='dropdown cursor-pointer font-serif'>
        ▶
      </button>
      {isDropdown && <DropdownContext />}
    </div>
  );

  function DropdownContext() {
    return (
      <div className='absolute z-10'>
        <Button
          // clickHandler={editPost}
          clickHandler={() => onEditMenuClick(post.id)}
          // clickHandler={() => onPostEdit(post.id)}
          value='Edit'
          extraStyle='w-full '
        />
        <Button
          clickHandler={del}
          value={'Delete'}
          extraStyle='w-full '
        />
      </div>
    )
  }
  //
  // function editPost() {
  //   setPreEditedText(post.text);
  //   // toggleEditMenu(post.id);
  //   // toggleDropdownMenu(0);
  //   // setTimeout(() => {
  //   //   postTextElmnt.current.focus();
  //   // }, 100);
  // }

  function del() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/delete/${post.id}/` }
    );
  }

}
