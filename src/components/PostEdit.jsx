import { useFetcher } from 'react-router-dom';
import { useEffect } from 'react';

export function PostEdit({ setPostEditable, postTextElmnt, postId, postTextBeforeEdit }) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.edited) {
      setPostEditable(0);
    }
  }, [fetcher, setPostEditable]);

  return (
    <>
      <div className={'float-right'}>
        <button type='button' className={'mr-4'} onClick={cancelEdit}>
          Cancel
        </button>
        <button type='button'
                disabled={fetcher.state !== 'idle'}
                onClick={testSubm}>
          {`${fetcher.state === 'submitting' ? 'Saving...' : 'Update'}`}
        </button>
      </div>
      <div className='text-center text-red-500 text-lg float-right'>
        {fetcher.data && fetcher.data.errors}
      </div>
    </>
  );

  function testSubm() {
    fetcher.submit(
      { text: postTextElmnt.current.innerHTML.trim() },
      { method: 'patch', action: `/edit/${postId}/` });
  }

  function cancelEdit() {
    postTextElmnt.current.innerHTML = postTextBeforeEdit;
    // postTextElmnt.current.style.width = '100%';  bug: if picture attached, it changes position
    postTextElmnt.current.style.height = '100%';
    setPostEditable(0);
  }

}
