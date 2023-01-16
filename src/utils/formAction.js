import { redirect } from 'react-router-dom';

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
  return r.json();
}
