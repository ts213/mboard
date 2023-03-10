import { SubmitButton } from './SubmitButton.jsx';
import { useFetcher } from 'react-router-dom';
import { useContextApi, useMenuId } from '../ContextProvider.jsx';

export function PostToggleMenu({
                                 post,
                                 // setPreEditedText,
                                 postTextElmnt,
                                 setEditMenu
                               }) {

  const fetcher = useFetcher();
  // const { onPostMenuClick, onPostEdit } = useContextApi();
  const { onPostMenuClick } = useContextApi();
  const menuId = useMenuId();

  return (
    <div className='ml-2 inline-block'>
      <button type='button'
              onClick={() => onPostMenuClick(post.id)}
              className='dropdown cursor-pointer font-serif'>
        ▶
      </button>
      {menuId === post.id && <DropdownContext />}
    </div>
  );

  function DropdownContext() {
    return (
      <div className='absolute z-10'>
        <SubmitButton
          // clickHandler={editPost}
          clickHandler={() => setEditMenu(menuId => menuId === post.id ? 0 : post.id)}
          // clickHandler={() => onPostEdit(post.id)}
          value='Edit'
          extraStyle='w-full '
        />
        <SubmitButton
          clickHandler={del}
          value={'Delete'}
          extraStyle='w-full '
        />
      </div>
    )
  }

  function editPost() {
    setPreEditedText(post.text);
    // toggleEditMenu(post.id);
    // toggleDropdownMenu(0);
    // setTimeout(() => {
    //   postTextElmnt.current.focus();
    // }, 100);
  }

  function del() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/delete/${post.id}/` }
    );
  }

}
