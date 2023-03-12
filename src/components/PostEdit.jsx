import { useFetcher } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Button } from './Button.jsx';

export function PostEdit({
                           postId,
                           onEditMenuClick,
                           postTextElmnt,
                           // postTextBeforeEdit
                         }) {
  const fetcher = useFetcher();
  const textareaRef = useRef();

  // useEffect(() => {
  //   if (fetcher.state === 'idle' && fetcher.data?.edited) {
  //     setPostEditable(0);
  //   }
  // }, [fetcher, setPostEditable]);
  useEffect(() => {
    textareaRef.current.focus();
    textareaRef.current.selectionStart = textareaRef.current.value.length;  // moving caret to end of text

  }, []);

  return (
    <>
      <textarea className='block outline-none resize overflow-scroll bg-slate-800 pb-10 w-[100%]'
                defaultValue={postTextElmnt.innerText}
                ref={textareaRef}
      />
      <div className='text-center text-red-500 text-lg float-right'>
        {fetcher.data && fetcher.data.errors}
      </div>
      <div className={'float-right mt-5 clear-both'}>
        <Button type='button'
                value='Cancel'
                clickHandler={() => onEditMenuClick(0)}
                extraStyle='mr-4 '
        />
        <Button type='button'
                value='Update'
                clickHandler={testSubm}
                disabled={fetcher.state !== 'idle'}
                submitting={fetcher.state === 'submitting'}
        />
      </div>
    </>
  );

  function testSubm() {
    fetcher.submit(
      { text: textareaRef.current.value },
      { method: 'patch', action: `/edit/${postId}/` }
    );
    // console.log(fetcher.formData)
  }
}
