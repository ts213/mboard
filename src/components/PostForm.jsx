import { Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { SubmitButton } from './SubmitButton';


export function PostForm() {
  const error = useActionData();
  const { threadId, board } = useLoaderData();
  const navigation = useNavigation();

  return (
    <Form action=''
          method='post'
          className='mb-20'>
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
      <input hidden name='board' readOnly value={board}/>
      <input hidden name='threadId' readOnly value={threadId}/>
    </Form>
  )
}

export async function formAction({ request }) {
  const formData = await request.formData();
  try {
    await submitForm(formData);
  } catch (e) {
    return e;  // stopping here if error, error is available in useActionData()
  }
  return redirect('');
}

async function submitForm(formData) {
  const url = `/api${location.pathname}`;
  const r = await fetch(url, {
    body: formData,
    method: 'POST',
  });
  if (r.status !== 201) {
    throw { msg: 'response error', status: 422 };
  }
}

