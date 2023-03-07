import { SubmitButton } from './SubmitButton.jsx';
import { useFetcher } from 'react-router-dom';
import { useContextApi, useMenuIdApi } from '../ContextProvider.jsx';

export function PostToggleMenu({
                                 post,
                                 // setPostTextBeforeEdit,
                                 // postTextElmnt,
                               }) {

  const fetcher = useFetcher();
  const { onPostMenuClick } = useContextApi();
  const menuId  = useMenuIdApi();

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
        {/*<SubmitButton clickHandler={editPost} value='Edit' extraStyle='w-full ' />*/}
        <SubmitButton
          clickHandler={del}
          value={'Delete'}
          extraStyle='w-full '
        />
      </div>
    )
  }

  //
  // function editPost() {
  //   setPostTextBeforeEdit(post.text);
  //   toggleEditMenu(post.id);
  //   toggleDropdownMenu(0);
  //   setTimeout(() => {
  //     postTextElmnt.current.focus();
  //   }, 100);
  // }

  function del() {
    fetcher.submit(
      null,
      { method: 'delete', action: `/delete/${post.id}/` }
    );
  }

}
