import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { SubmitButton } from './SubmitButton';


export function PostForm() {
  const error = useActionData();
  const { threadId, board } = useLoaderData();
  const navigation = useNavigation();

  return (
    <Form action='' method='post' className='mb-20' encType='multipart/form-data'>
      <div className='text-center text-red-500 text-lg'>
        {error && <p>{error.msg} {error.status}</p>}
      </div>
      <div className='m-auto w-3/6 flex'>
        <input type='text' name='poster' className='grow border dark:border-gray-600 bg-slate-800 text-white'/>
        <SubmitButton submitting={navigation.state === 'submitting'}/>
      </div>
      <textarea name='text' rows='7'
                className='m-auto resize block border dark:border-gray-600 w-3/6 bg-slate-800 text-white'>
      </textarea>
      <input type='file' name='file' className='m-auto block'/>
      <input hidden name='board' readOnly value={board}/>
      <input hidden name='threadId' readOnly value={threadId}/>
    </Form>
  )
}


