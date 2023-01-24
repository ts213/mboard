export function PostMenuButton({ post, menuId, toggleDropdownMenu, testRef,
                                 postInput, setPostInput, setPostEditable, toggleEditMenu }) {

  return (
    <div className='ml-2 relative inline-block'>
      <button type='button'
        onClick={() => toggleDropdownMenu(post.id)}
        className='cursor-pointer font-serif'>
        ▶
      </button>
      {menuId === post.id && <DropdownContext />}
    </div>
  );

  function DropdownContext() {
    return (
      <div className='absolute z-10 bg-slate-800 min-w-full'>
        <button type='submit'
                onClick={() => t()}
                className='mt-3 pb-3 pr-3 pl-3 cursor-pointer block'>
          Edit
        </button>
        <button type='submit' formAction={`/delete/${post.id}/`} formMethod='delete'
                className='pt-3 mb-3 pr-3 pl-3 cursor-pointer block'>
          Delete
        </button>
      </div>
    )
  }

  function t() {
    toggleEditMenu(post.id);
    toggleDropdownMenu(0);
    // p.current.contentEditable = true;
  }

  // function editPost(e, id) {
  //   // e.target.contentEditable = true;
  // }

}
