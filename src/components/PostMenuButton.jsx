import { useContext } from 'react';
import { MenuContext } from './Thread';

export function PostMenuButton({ post }) {
  const menu = useContext(MenuContext);

  function editPost(e, id) {
    console.log(e, id)
    console.log(arguments)
  }

  return (
    <div className='ml-2 relative inline-block'>
      <button
        onClick={() => menu.togglePostMenu(post.id)}
        className='cursor-pointer font-serif'>
        ▶
      </button>
      {menu.menuId === post.id && <DropdownContext />}
    </div>
  );

  function DropdownContext() {
    return (
      <div className='absolute z-10 bg-slate-800 min-w-full'>
        <button type='submit' formAction={`/delete/${post.id}/`} formMethod='delete'
                className='pt-3 mb-3 pr-3 pl-3 cursor-pointer block'>
          Delete
        </button>
        <button type='submit' onClick={(e) => editPost(e, post.id)}
                className='mt-3 pb-3 pr-3 pl-3 cursor-pointer block'>
          Edit
        </button>
      </div>
    )
  }
}
